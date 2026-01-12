import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5 text-center">
          <div className="error-boundary">
            <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-4" 
                 style={{ width: '80px', height: '80px' }}>
              <FaExclamationTriangle size={40} />
            </div>
            
            <h1 className="display-4 fw-bold text-danger mb-3">Oops! Something went wrong</h1>
            <p className="lead text-muted mb-4">
              We're sorry for the inconvenience. Please try refreshing the page or return to the homepage.
            </p>
            
            <div className="d-flex justify-content-center gap-3 mb-4">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={this.handleRefresh}
                className="px-4"
              >
                Refresh Page
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg" 
                onClick={this.handleGoHome}
                className="px-4"
              >
                <FaHome className="me-2" />
                Go to Homepage
              </Button>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-start mt-4 p-4 border rounded bg-light">
                <h5 className="text-danger mb-3">Error Details:</h5>
                <pre className="text-danger small">
                  {this.state.error && this.state.error.toString()}
                </pre>
                <details className="mt-3">
                  <summary>Stack Trace</summary>
                  <pre className="text-muted small mt-2">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="mt-5">
              <p className="text-muted">
                If the problem persists, please contact our support team.
              </p>
              <Button variant="link" href="/contact">
                Contact Support
              </Button>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;