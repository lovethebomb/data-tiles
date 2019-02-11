import fetch from 'unfetch';

export default class ServiceGithub {
    private baseURL: string;

    constructor() {
        this.baseURL = 'https://api.github.com';
    }

    public async getLatestRepo(user) {
        const endpoint = `/users/${user}/repos?type=owner&sort=pushed&page=1&per_page=1`
        const res = await this.createRequest(endpoint)
        let data = await res.json()
        data = res.ok ? data[0] : data
        return {
            data,
            ok: res.ok,
            status: res.status
        }
    }

    private async createRequest(endpoint) {
        const url = `${this.baseURL}${endpoint}`
        return fetch(url);
    }
}