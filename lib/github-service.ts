export default class ServiceGithub {
    private baseURL = 'https://api.github.com';

    async createRequest(endpoint: string) {
        const url = `${this.baseURL}${endpoint}`
        return fetch(url);
    }

    public async getLatestRepo(user: string) {
        const endpoint = `/users/${user}/repos?type=owner&sort=pushed&page=1&per_page=1`
        const res = await this.createRequest(endpoint)
        const data = await res.json()
        return data[0];
    }
}