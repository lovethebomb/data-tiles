import fetch from 'unfetch';

export default class ServiceDiscogs {
    private apiKey: any;
    private baseURL: string;

    constructor({ apiKey }) {
        if (!apiKey) {
            throw new Error('missing apiKey parameter');
        }

        this.apiKey = apiKey;
        this.baseURL = 'https://api.discogs.com';
    }

    public async getCollection(user, collectionId = 0, sort = "added", sortOrder = "desc", page = 1, perPage = 50) {
        const endpoint = `/users/${user}/collection/folders/${collectionId}/releases`
        const res = await this.createRequest(endpoint, `&sort=${sort}&sort_order=${sortOrder}&page=${page}&per_page=${perPage}`)
        const data = await res.json()
        return {
            data,
            ok: res.ok,
            status: res.status,
        }
    }

    public async getLastestCollectionItem(user, collectionId = 0) {
        return this.getCollection(user, collectionId, "added", "desc", 1, 1);
    }

    public async getWantlist(user, sort = "added", sortOrder = "desc", page = 1, perPage = 50) {
        const endpoint = `/users/${user}/wants`
        const res = await this.createRequest(endpoint, `&sort=${sort}&sort_order=${sortOrder}&page=${page}&per_page=${perPage}`)
        const data = await res.json()
        return {
            data,
            ok: res.ok,
            status: res.status,
        }
    }

    public async getLatestWanted(user) {
        return await this.getWantlist(user, "added", "desc", 1, 1);
    }

    private async createRequest(endpoint, parameters = "") {
        const url = `${this.baseURL}${endpoint}?key=${this.apiKey}${parameters}`
        return fetch(url);
    }
}