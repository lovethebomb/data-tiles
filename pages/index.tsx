import { StatelessComponent } from 'next';
import React, { ComponentClass } from 'react'

import Header from '../components/Header'
import Layout from '../components/Layout'
import TileDiscogs from '../components/Tile/variants/TileDiscogs'
import TileGithub from '../components/Tile/variants/TileGithub'
import TileLastFM from '../components/Tile/variants/TileLastFM'
import TileMetrics from '../components/Tile/variants/TileMetrics'
import TileOverwatch from '../components/Tile/variants/TileOverwatch'
import TilePUBG from '../components/Tile/variants/TilePUBG'
import TileQuakeChampions from '../components/Tile/variants/TileQuakeChampions'

const TILES = [
    TileLastFM,
    TileOverwatch,
    TilePUBG,
    TileDiscogs,
    TileGithub,
    TileMetrics,
    TileQuakeChampions ];

const Index: StatelessComponent<any> = () => (
    <Layout>
        <Header />
        <div className="Tiles">
            {TILES.map((tile, index) => React.createElement(tile as ComponentClass<any>, { key: index }))}
        </div>
        <style jsx>{`
      .Tiles {
        margin: 2em 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, 320px);
        grid-gap: 20px;
        grid-auto-rows: 0px;
      }`}
        </style>
    </Layout>
)

export default Index;