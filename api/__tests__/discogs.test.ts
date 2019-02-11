import discogs from '../discogs';

describe('API/Discogs', () => {
    test('should throw when no apiKey set', () => {
        expect(() => {
            const service = new discogs(null);
            return service;
        }).toThrow();
    });
})