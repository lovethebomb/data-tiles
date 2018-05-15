export default class ServiceOverwatch {

    private baseURL = 'https://ow-api.com/v1';

    async createRequest(endpoint: string) {
        const url = `${this.baseURL}${endpoint}`
        return fetch(url);
    }

    public async getProfile(user: string, platform = "pc", region = "eu") {
        const endpoint = `/stats/${platform}/${region}/${user}/profile`
        const res = await this.createRequest(endpoint)
        const data = await res.json()
        return data;
    }
}