import fetch from 'unfetch';

export default class ServicePUBG {
    private static getPlayerLastMatch(player) {
        if (player.relationships) {
            return player.relationships.matches.data[0];
        }
        return player.data[0].relationships.matches.data[0];
    }

    private static getParticipants(match)  {
        return match.included.filter(item => item.type === "participant");
    }

    private static getParticipant(participants, playerId) {
        return participants.filter(participant => participant.attributes.stats.playerId === playerId)[0];
    }

    private apiKey: any;
    private baseURL: string
    private region: string

    constructor({ apiKey, region = "pc-eu"}) {
        if (!apiKey) {
            throw new Error('missing apiKey parameter');
        }
        
        this.apiKey = apiKey;
        this.region = region;
        this.baseURL = 'https://api.playbattlegrounds.com/shards/';
    }

    public async getPlayer(playerId) {
        const endpoint = `/players?filter[playerIds]=${playerId}`
        const res = await this.createRequest(endpoint)
        let data = await res.json()
        data = res.ok ? data.data[0] : data
        return {
            data,
            ok: res.ok,
            status: res.status
        }
    }

    public async getMatch(matchId) {
        const endpoint = `/matches/${matchId}`
        const res = await this.createRequest(endpoint)
        const data = await res.json()
        return {
            data,
            ok: res.ok,
            status: res.status
        }
    }

    public async getLastGame(playerId) {
        const player = await this.getPlayer(playerId);
        const lastMatchId = ServicePUBG.getPlayerLastMatch(player.data).id;
        const lastMatch = await this.getMatch(lastMatchId);
        const participants = ServicePUBG.getParticipants(lastMatch.data);
        const playerParticipant = ServicePUBG.getParticipant(participants, playerId)
        const { damageDealt, kills, longestKill, walkDistance, timeSurvived, winPlace} = playerParticipant.attributes.stats;
        const name = player.data.attributes.name;
        return {
            data: {
                damageDealt,
                kills,
                lastMatch,
                longestKill,
                name,
                player,
                timeSurvived,
                walkDistance,
                winPlace
            },
            ok: lastMatch.ok,
            status: lastMatch.status
        }
    }

    private async createRequest(endpoint) {
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/vnd.api+json'
        }
        const url = `${this.baseURL}${this.region}${endpoint}`
        return fetch(url, { headers });
    }

}