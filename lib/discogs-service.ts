export default class ServiceDiscogs {
    private apiKey: string;

    private baseURL = 'https://api.discogs.com';

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('missing apiKey parameter');
        }

        this.apiKey = apiKey;
    }

    async createRequest(endpoint: string, parameters: string) {
        const url = `${this.baseURL}${endpoint}?key=${this.apiKey}${parameters}`
        return fetch(url);
    }

    public async getCollection(user: string, collectionId = 0, sort = "added", sortOrder = "desc", page = 1, perPage = 50) {
        const endpoint = `/users/${user}/collection/folders/${collectionId}/releases`
        const res = await this.createRequest(endpoint, `&sort=${sort}&sort_order=${sortOrder}&page=${page}&per_page=${perPage}`)
        const data = await res.json()
        return data;
    }

    public async getLastestCollectionItem(user: string, collectionId = 0) {
        return this.getCollection(user, collectionId, "added", "desc", 1, 1);
    }

    public async getWantlist(user: string, sort = "added", sortOrder = "desc", page = 1, perPage = 50) {
        const endpoint = `/users/${user}/wants`
        const res = await this.createRequest(endpoint, `&sort=${sort}&sort_order=${sortOrder}&page=${page}&per_page=${perPage}`)
        const data = await res.json()
        return data;
    }

    public async getLatestWanted(user: string) {
        return this.getWantlist(user, "added", "desc", 1, 1);
    }
}