export const sanitizeInput = (input = '', type = '') => {
    if (type === 'email') {
        // Allow valid email characters
        return input.replace(/[^a-zA-Z0-9@._-]/g, '').trim();
    }
    if (type === 'password') {
        // Allow letters, numbers, and special characters for passwords
        return input.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|;':",.<>?]/g, '').trim();
    }
    // Default sanitization for other inputs
    return input.replace(/[^\w\s]/gi, '').trim();
};

export const validateUsername = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username);

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;':",.<>?]).{8,50}$/.test(password);

export const validateName = (name) => /^[a-zA-Z\s-]{2,50}$/.test(name);

export const sanitizeSearchQuery = (query) => query.replace(/[^\w\s-]/gi, '').trim();
