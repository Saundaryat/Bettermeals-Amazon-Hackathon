/**
 * Maps standard Firebase Authentication error codes to user-friendly messages.
 * This ensures consistency across the application and cleans up UI code.
 */
export const getAuthErrorMessage = (err: any, defaultMessage: string = "Authentication failed. Please try again."): string => {
    if (err?.code) {
        switch (err.code) {
            // Login & Registration errors
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
                return "Invalid email or password. Please check your credentials and try again.";
            case 'auth/user-not-found':
                return "No account found with this email. Please check your email or register for a new account.";
            case 'auth/too-many-requests':
                return "Too many failed attempts. Please wait a moment before trying again.";
            case 'auth/network-request-failed':
                return "Network error. Please check your internet connection and try again.";
            case 'auth/invalid-email':
                return "Please enter a valid email address.";

            // Password Reset Errors
            case 'auth/expired-action-code':
                return "The password reset link has expired. Please request a new one.";
            case 'auth/invalid-action-code':
                return "The password reset link is invalid. It may have already been used.";
            case 'auth/user-disabled':
                return "This account has been disabled.";
            case 'auth/weak-password':
                return "Password is too weak. Please use a stronger password.";
        }
    }

    // Fallback string matching for generic/non-Firebase errors
    if (err?.message) {
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes('backend authentication failed')) {
            return "Authentication failed. Please try again or contact support if the problem persists.";
        } else if (errorMessage.includes('firebase')) {
            return "Login service temporarily unavailable. Please try again in a moment.";
        } else {
            return err.message; // Might be a safe custom backend error
        }
    }

    return defaultMessage;
};
