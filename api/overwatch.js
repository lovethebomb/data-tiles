require('isomorphic-fetch')
class ServiceOverwatch {
    constructor() {
        this.baseURL = 'https://ow-api.com/v1';
    }

    async createRequest(endpoint) {
        const url = `${this.baseURL}${endpoint}`
        return fetch(url);
    }

    async getProfile(user, platform = "pc", region = "eu") {
        const endpoint = `/stats/${platform}/${region}/${user}/profile`
        const res = await this.createRequest(endpoint)
        const data = await res.json()
        return {
            ok: res.ok,
            status: res.status,
            data
        }
    }
}

module.exports = ServiceOverwatch