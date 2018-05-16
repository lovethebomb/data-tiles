require('isomorphic-fetch');
class ServiceGithub {
    constructor() {
        this.baseURL = 'https://api.github.com';
    }

    async createRequest(endpoint) {
        const url = `${this.baseURL}${endpoint}`
        return fetch(url);
    }

    async getLatestRepo(user) {
        const endpoint = `/users/${user}/repos?type=owner&sort=pushed&page=1&per_page=1`
        const res = await this.createRequest(endpoint)
        let data = await res.json()
        data = res.ok ? data[0] : data
        return {
            ok: res.ok,
            status: res.status,
            data
        }
    }
}

module.exports = ServiceGithub