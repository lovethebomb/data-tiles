export default class ServicePUBG {
    apiKey: string;
    region: string;

    private baseURL = 'https://api.playbattlegrounds.com/shards/';

    constructor(apiKey: string, region: string = "pc-eu") {
        this.apiKey = apiKey;
        this.region = region;
    }

    async createRequest(endpoint: string) {
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/vnd.api+json'
        }
        const url = `${this.baseURL}${this.region}${endpoint}`
        return fetch(url, { headers });
    }

    public async getPlayer(playerId: string) {
        const endpoint = `/players?filter[playerIds]=${playerId}`
        const res = await this.createRequest(endpoint)
        const data = await res.json()
        console.log('[ServicePubg] player fetched', data)
        return data.data[0];
    }

    public async getMatch(matchId: string) {
    
        const endpoint = `/matches/${matchId}`
        const res = await this.createRequest(endpoint)
        const data = await res.json()

        console.log('[ServicePubg] match fetched', data)
        return data
    }

    public getPlayerLastMatch(player) {
        if (player.relationships) {
            return player.relationships.matches.data[0];
        }
        return player.data[0].relationships.matches.data[0];
    }

    public getParticipants(match)  {
        return match.included.filter(item => item.type === "participant");
    }

    public getParticipant(participants, playerId) {
        return participants.filter(participant => participant.attributes.stats.playerId === playerId)[0];
    }
}
