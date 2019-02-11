const discogs = require('../discogs.ts');

describe('API/Discogs', () => {
    test('should throw when no apiKey set', () => {
        expect(() => {
            const service = new discogs();
            return service;
        }).toThrow();
    });

    test('should set apiKey correctly', () => {
        const service = new discogs({apiKey: 'this-is-api-key'});
        expect(service.apiKey).toBe('this-is-api-key');
    });
})