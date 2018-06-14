const closestIndexTo = require('date-fns/closestIndexTo')

const QuakeChampionsClient = require('quake-champions-api')
// require('isomorphic-fetch')

class ServiceQuakeChampions {
    constructor() {
        this.client = new QuakeChampionsClient();
    }

    async getProfile(username) {
        if (!username) {
            throw new Error('/api/quake/getProfile missing username')
        }

        const player = await this.client.player.get(username)
        const now = new Date();
        const latestMatchIndex = closestIndexTo(now, player.matches.map(match => match.playedDateTime))
        const latestMatch = await this.client.match.get(player.matches[latestMatchIndex].id, username)
        const data = { player, latestMatch: latestMatch.summary };

        return {
            ok: true,
            status: 200,
            data
        }
    }
}

module.exports = ServiceQuakeChampions