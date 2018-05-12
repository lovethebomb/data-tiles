import fetch from 'isomorphic-unfetch'
import { StatelessComponent } from 'next';
import React from 'react'

import Layout from '../components/Layout'
import TilePUBG from '../components/Tile/variants/TilePUBG'
import TileLastFM from '../components/Tile/variants/TileLastFM'

import config from '../config.js'

const Index: StatelessComponent<any> = (props) => (
    <Layout>
        <h1>Data Tiles</h1>
        <div className="tiles">
            <TileLastFM username={config.LASTFM_USERNAME} apiKey={config.LASTFM_API_KEY} />
            <TilePUBG playerId={config.PUBG_PLAYER_ID} apiKey={config.PUBG_API_KEY} />
        </div>
        <style jsx>{`
      .tiles {
        margin: 2em 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }`}
        </style>
    </Layout>
)

// Index.getInitialProps = async function () {
//     const res = await fetch('https://api.tvmaze.com/search/shows?q=batman')
//     const data = await res.json()

//     console.log(`Show data fetched. Count: ${data.length}`)

//     return {
//       shows: data
//     }
// }

export default Index;