import closestIndexTo from 'date-fns/closestIndexTo'

import QuakeChampionsClient from 'quake-champions-api'

export default class ServiceQuakeChampions {
    private client: any;

    constructor() {
        this.client = new QuakeChampionsClient();
    }

    public async getProfile(username) {
        if (!username) {
            throw new Error('/api/quake/getProfile missing username')
        }

        const player = await this.client.player.get(username)
        const now = new Date();
        const latestMatchIndex = closestIndexTo(now, player.matches.map(match => match.playedDateTime))
        const latestMatch = await this.client.match.get(player.matches[latestMatchIndex].id, username)
        const data = { player, latestMatch: latestMatch.summary };

        return {
            data,
            ok: true,
            status: 200
        }
    }
}

module.exports = ServiceQuakeChampions