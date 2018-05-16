require('isomorphic-fetch');
class ServicePUBG {
    constructor({ apiKey, region = "pc-eu"}) {
        if (!apiKey) {
            throw new Error('missing apiKey parameter');
        }
        
        this.apiKey = apiKey;
        this.region = region;
        this.baseURL = 'https://api.playbattlegrounds.com/shards/';
    }

    async createRequest(endpoint) {
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'accept': 'application/vnd.api+json'
        }
        const url = `${this.baseURL}${this.region}${endpoint}`
        return fetch(url, { headers });
    }

    async getPlayer(playerId) {
        const endpoint = `/players?filter[playerIds]=${playerId}`
        const res = await this.createRequest(endpoint)
        let data = await res.json()
        data = res.ok ? data.data[0] : data
        return {
            ok: res.ok,
            status: res.status,
            data
        }
    }

    async getMatch(matchId) {
        const endpoint = `/matches/${matchId}`
        const res = await this.createRequest(endpoint)
        const data = await res.json()
        return {
            ok: res.ok,
            status: res.status,
            data
        }
    }

    async getLastGame(playerId) {
        const player = await this.getPlayer(playerId);
        const lastMatchId = this.constructor.getPlayerLastMatch(player.data).id;
        const lastMatch = await this.getMatch(lastMatchId);
        const participants = this.constructor.getParticipants(lastMatch.data);
        const playerParticipant = this.constructor.getParticipant(participants, playerId)
        const { damageDealt, kills, longestKill, walkDistance, timeSurvived, winPlace} = playerParticipant.attributes.stats;
        const name = player.data.attributes.name;
        return {
            ok: lastMatch.ok,
            status: lastMatch.status,
            data: {
                damageDealt,
                kills,
                lastMatch,
                longestKill,
                name: name,
                player,
                timeSurvived,
                walkDistance,
                winPlace
            }
        }
    }

    static getPlayerLastMatch(player) {
        if (player.relationships) {
            return player.relationships.matches.data[0];
        }
        return player.data[0].relationships.matches.data[0];
    }

    static getParticipants(match)  {
        return match.included.filter(item => item.type === "participant");
    }

    static getParticipant(participants, playerId) {
        return participants.filter(participant => participant.attributes.stats.playerId === playerId)[0];
    }
}

module.exports = ServicePUBG