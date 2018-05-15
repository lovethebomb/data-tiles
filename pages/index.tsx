import fetch from 'isomorphic-unfetch'
import { StatelessComponent } from 'next';
import React from 'react'

import Layout from '../components/Layout'
import TileDiscogs from '../components/Tile/variants/TileDiscogs'
import TileLastFM from '../components/Tile/variants/TileLastFM'
import TilePUBG from '../components/Tile/variants/TilePUBG'
import TileOverwatch from '../components/Tile/variants/TileOverwatch'
import TileGithub from '../components/Tile/variants/TileGithub'

import config from '../config.js'

const dataTiles = [
    {
        component: TileLastFM,
        props: { username: config.LASTFM_USERNAME, apiKey: config.LASTFM_API_KEY } 
    },
    {
        component: TilePUBG,
        props: { playerId: config.PUBG_PLAYER_ID, apiKey: config.PUBG_API_KEY } 
    },
    {
        component: TileOverwatch,
        props: { username: config.BATTLE_NET_USER } 
    },
    {
        component: TileDiscogs,
        props: { username: config.DISCOGS_USERNAME, apiKey: config.DISCOGS_API_KEY } 
    },
    {
        component: TileGithub,
        props: { username: config.GITHUB_USERNAME } 
    }
];


const renderTiles = (tiles) => {
    // TODO: manage randomness from both server and client
    return (
        <React.Fragment>
            {tiles.map( (tile, index) => React.createElement(tile.component, { key: index, ...tile.props }))}
        </React.Fragment>
    )
}

const Index: StatelessComponent<any> = () => (
    <Layout>
        <h1>Data Tiles</h1>
        <div className="Tiles">
            { renderTiles(dataTiles) }
        </div>
        <style jsx>{`
      .Tiles {
        margin: 2em 0;
        display: flex;
        flex-flow: row wrap;
      }`}
        </style>
    </Layout>
)

export default Index;