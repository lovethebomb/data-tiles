import closestIndexTo = require('date-fns/closestIndexTo')
import parseISO = require('date-fns/parseISO')

import QuakeChampionsClient = require('quake-champions-api')

class ServiceQuakeChampions {
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
        const latestMatchIndex = closestIndexTo(now, player.matches.map(match => parseISO(match.playedDateTime)))

        if (!latestMatchIndex) {
            return {
                data: {},
                ok: false,
                status: 200 
            }
        }

        const latestMatch = await this.client.match.get(player.matches[latestMatchIndex].id, username)
        const data = { player, latestMatch: latestMatch.summary };

        return {
            data,
            ok: true,
            status: 200
        }
    }
}

export = ServiceQuakeChampions;