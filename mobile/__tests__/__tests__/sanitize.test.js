import { sanitizeInput } from '../utils/sanitize';

describe('sanitizeInput', () => {
    it('removes invalid characters from email', () => {
        const result = sanitizeInput('test@!example.com');
        expect(result).toBe('testexamplecom');
    });

    it('removes special characters from a general input', () => {
        const result = sanitizeInput('Hello@World!');
        expect(result).toBe('HelloWorld');
    });

    it('trims whitespace from the input', () => {
        const result = sanitizeInput('   spaced input   ');
        expect(result).toBe('spaced input');
    });

    it('allows valid input without modification', () => {
        const result = sanitizeInput('ValidInput123');
        expect(result).toBe('ValidInput123');
    });
});
