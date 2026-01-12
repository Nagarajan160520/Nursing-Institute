const twilio = require('twilio');
const axios = require('axios');
require('dotenv').config();

class SMSService {
    constructor() {
        // Initialize Twilio for international SMS
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.twilioClient = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
        }

        // For India SMS (using MSG91, TextLocal, or similar)
        this.indiaSMSConfig = {
            apiKey: process.env.INDIA_SMS_API_KEY,
            senderId: process.env.INDIA_SMS_SENDER_ID || 'EDUINST',
            route: process.env.INDIA_SMS_ROUTE || '4' // Transactional
        };
    }

    // Format Indian mobile number
    formatIndianMobile(mobile) {
        if (!mobile) return null;
        
        let cleaned = mobile.toString().replace(/\D/g, '');
        
        // Remove country code if present
        if (cleaned.startsWith('91')) {
            cleaned = cleaned.substring(2);
        }
        
        // Ensure 10 digits
        if (cleaned.length === 10) {
            return `+91${cleaned}`;
        }
        
        return null;
    }

    // Check if number is Indian
    isIndianNumber(mobile) {
        const formatted = this.formatIndianMobile(mobile);
        return formatted && formatted.startsWith('+91');
    }

    // Send SMS via Indian provider (MSG91 example)
    async sendViaIndiaSMS(to, message) {
        try {
            const url = 'https://api.msg91.com/api/v5/flow/';
            
            const payload = {
                sender: this.indiaSMSConfig.senderId,
                mobiles: to.replace('+91', ''),
                message: message,
                route: this.indiaSMSConfig.route
            };

            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'authkey': this.indiaSMSConfig.apiKey
                }
            });

            console.log('India SMS sent:', response.data);
            return { success: true, provider: 'india', response: response.data };
            
        } catch (error) {
            console.error('India SMS error:', error.response?.data || error.message);
            
            // Fallback to Twilio if available
            if (this.twilioClient) {
                return this.sendViaTwilio(to, message);
            }
            
            return { success: false, error: error.message };
        }
    }

    // Send SMS via Twilio
    async sendViaTwilio(to, message) {
        try {
            if (!this.twilioClient) {
                throw new Error('Twilio not configured');
            }

            const response = await this.twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: to
            });

            console.log('Twilio SMS sent:', response.sid);
            return { success: true, provider: 'twilio', sid: response.sid };
            
        } catch (error) {
            console.error('Twilio SMS error:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Main send SMS method
    async sendSMS(to, message) {
        try {
            const formattedTo = this.formatIndianMobile(to);
            
            if (!formattedTo) {
                return { success: false, error: 'Invalid mobile number' };
            }

            // Use India SMS for Indian numbers, Twilio for others
            if (this.isIndianNumber(to) && this.indiaSMSConfig.apiKey) {
                return await this.sendViaIndiaSMS(formattedTo, message);
            } else if (this.twilioClient) {
                return await this.sendViaTwilio(formattedTo, message);
            } else {
                return { success: false, error: 'No SMS provider configured' };
            }
            
        } catch (error) {
            console.error('SMS sending error:', error);
            return { success: false, error: error.message };
        }
    }

    // Send marks notification to parent
    async sendMarksNotification(student, marks, examType) {
        try {
            const parentMobile = student.fatherMobile || student.contactNumber;
            
            if (!parentMobile) {
                console.log('No parent mobile number found for:', student.fullName);
                return { success: false, error: 'No mobile number' };
            }

            // Calculate total
            const totalObtained = marks.marks.theory.obtained + 
                                 marks.marks.practical.obtained + 
                                 marks.marks.viva.obtained + 
                                 marks.marks.assignment.obtained;
            
            const totalMax = marks.marks.theory.max + 
                            marks.marks.practical.max + 
                            marks.marks.viva.max + 
                            marks.marks.assignment.max;
            
            const percentage = ((totalObtained / totalMax) * 100).toFixed(2);

            // Create message
            const message = `Dear Parent,\n\n` +
                           `Your ward ${student.fullName} (${student.studentId}) ` +
                           `has received marks in ${marks.subject} (${examType}).\n\n` +
                           `Theory: ${marks.marks.theory.obtained}/${marks.marks.theory.max}\n` +
                           `Practical: ${marks.marks.practical.obtained}/${marks.marks.practical.max}\n` +
                           `Viva: ${marks.marks.viva.obtained}/${marks.marks.viva.max}\n` +
                           `Assignment: ${marks.marks.assignment.obtained}/${marks.marks.assignment.max}\n` +
                           `Total: ${totalObtained}/${totalMax}\n` +
                           `Percentage: ${percentage}%\n` +
                           `Grade: ${marks.grade}\n\n` +
                           `- ${process.env.INSTITUTE_NAME || 'Nursing Institute'}`;

            return await this.sendSMS(parentMobile, message);
            
        } catch (error) {
            console.error('Marks notification error:', error);
            return { success: false, error: error.message };
        }
    }

    // Send bulk marks notifications
    async sendBulkMarksNotifications(studentsMarks, examType) {
        const results = [];
        
        for (const item of studentsMarks) {
            try {
                const result = await this.sendMarksNotification(item.student, item.marks, examType);
                results.push({
                    studentId: item.student.studentId,
                    mobile: item.student.fatherMobile,
                    success: result.success,
                    error: result.error
                });
                
                // Delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                results.push({
                    studentId: item.student.studentId,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }
}

module.exports = new SMSService();