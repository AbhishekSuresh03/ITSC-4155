export const sanitizeInput = (input = '') => input.replace(/[^\w\s]/gi, '').trim();

export const validateUsername = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username);

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,50}$/.test(password);

export const validateName = (name) => /^[a-zA-Z\s-]{2,50}$/.test(name);

export const sanitizeSearchQuery = (query) => query.replace(/[^\w\s-]/gi, '').trim(); 
