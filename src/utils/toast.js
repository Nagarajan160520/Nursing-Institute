import { toast as hotToast } from 'react-hot-toast';

export const toast = {
  success: (message, options = {}) => {
    return hotToast.success(message, {
      duration: 4000,
      ...options
    });
  },
  
  error: (message, options = {}) => {
    return hotToast.error(message, {
      duration: 6000,
      ...options
    });
  },
  
  info: (message, options = {}) => {
    return hotToast(message, {
      duration: 4000,
      icon: 'ℹ️',
      style: {
        background: '#3498db',
        color: 'white',
      },
      ...options
    });
  },
  
  warning: (message, options = {}) => {
    return hotToast(message, {
      duration: 5000,
      icon: '⚠️',
      style: {
        background: '#f39c12',
        color: 'white',
      },
      ...options
    });
  },
  
  loading: (message, options = {}) => {
    return hotToast.loading(message, options);
  },
  
  dismiss: hotToast.dismiss,
  
  remove: hotToast.remove
};

export default toast;