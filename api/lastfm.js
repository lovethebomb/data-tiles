require('isomorphic-fetch');
class ServiceLastFM {
    constructor({ apiKey }) {
        if (!apiKey) {
            throw new Error('missing apiKey parameter');
        }
        
        this.apiKey = apiKey;
        this.baseURL = 'http://ws.audioscrobbler.com/2.0/';
    }

    async createRequest(endpoint) {
        const url = `${this.baseURL}?method=${endpoint}&api_key=${this.apiKey}&format=json`
        return fetch(url);
    }

    async getRecentTracks(user, limit = 50) {
        const endpoint = `user.getrecenttracks&limit=${limit}&user=${user}`
        const res = await this.createRequest(endpoint)
        const data = await res.json()
        return {
            ok: res.ok,
            status: res.status,
            data
        }
    }

    async getLatestTrack(user) {
        return await this.getRecentTracks(user, 1)
    }
}

module.exports = ServiceLastFM