import ease from 'css-ease';
import React from 'react';
import { TransitionGroup } from 'react-transition-group'
import css from 'styled-jsx/css'

import { resolveScopedStyles }  from '../../../lib/styled-jsx';
import FadeIn from '../../Transition/FadeIn';
import Tile from '../Tile';
import TileContent from '../TileContent';
import TileHeader from '../TileHeader';

export interface TileDiscogsProps {
    username: string;
    apiKey: string;
}

interface ICollection {
    album: string;
    artists: object[];
    artistsString: string;
    format: object;
    formatsString: string;
    image: string;
}

export interface TileDiscogsState {
    isLoaded: boolean;
    collection: ICollection;
}

export default class TileDiscogs extends React.Component<TileDiscogsProps, TileDiscogsState> {
    public state = {
        collection: {
            album: "",
            artists: [],
            artistsString: "",
            format: {},
            formatsString: "",
            image: ""
        },
        isLoaded: false
    }

    public async getInitialData() {
        const res = await fetch('/api/v1/discogs/collection');
        return res.json()
    }

    public async componentDidMount() {
        const data = await this.getInitialData();
        const lastCollectionItem = data.data.releases[0]

        const artistsString = lastCollectionItem.basic_information.artists.map( artist => artist.name).join(', ');
        const descriptions = lastCollectionItem.basic_information.formats[0].descriptions.join(' ');
        const quantity = lastCollectionItem.basic_information.formats[0].qty; 

        const formatsString = `${lastCollectionItem.basic_information.formats[0].name} - ${quantity > 1 ? `${quantity}x` : ''}${descriptions}`

        const collection: ICollection = {
            album: lastCollectionItem.basic_information.title,
            artists: lastCollectionItem.basic_information.artists,
            artistsString,
            format: lastCollectionItem.basic_information.formats[0],
            formatsString,
            image: lastCollectionItem.basic_information.cover_image,
        }

        const isLoaded = true;
    
        return this.setState(Object.assign({}, this.state, {
            collection,
            isLoaded
        }));
    }

    public render() {
        const headerLink = "https://www.discogs.com/developers";
        const headerTitle = "Discogs API";
        const scoped = resolveScopedStyles(
            <scope>
                <style jsx={true}>{contentStyle}</style>
            </scope>
        )

        const containerClasses = [
            'Tile--TileDiscogs',
            scoped.className,
            this.state.isLoaded ? 'is-loaded' : ''
        ]
        const detailsCollection = [
            { className: "Tile__Details__Name", detail: this.state.collection.album },
            { className: "Tile__Details__Artist", detail: this.state.collection.artistsString },
            { className: "Tile__Details__Album", detail: this.state.collection.formatsString }
        ];


        
        return (
            <Tile containerClass={containerClasses.join(' ')} visible={this.state.isLoaded}>
                <TileHeader className={scoped.className}>
                    <a className="Tile__Header__Logo" href={headerLink} title={headerTitle} target="_blank" rel="noopener">
                        <Logo />
                    </a>
                    <span className="Tile__Header__TimeAgo">Lastest item</span>
                </TileHeader>
                <TileContent className={scoped.className}>
                    <Collection image={this.state.collection.image} details={detailsCollection} isLoaded={this.state.isLoaded}/>
                </TileContent>
                <style jsx={true}>{contentStyle}</style>
            </Tile>
        )
    }
}

const Collection = ({image, details, isLoaded}) => (
    <div className="Tile__Collection">
        <div className="Tile__Image">
            <img src={image} className="value" />
        </div>
        <div className="Tile__Details">
            <TransitionGroup component={null} appear={true}>
                {details.map((item, index) => (
                    <FadeIn
                        key={item.className}
                        duration={350}
                        delay={ (index * 100) + 0}
                        easing={ ease['ease-out-expo'] }
                        visible={isLoaded}>
                            <p className={item.className}>{item.detail}</p>
                    </FadeIn>
                ))}
            </TransitionGroup>
        </div>
        <style jsx={true}>{collectionStyle}</style>
    </div>
)

const Logo = () => (
    <div className="icon">
        <img src="/static/img/discogs/discogs-white.png" />
        <style jsx={true}>{`
                div {
                    display: inline-block;
                    width: 62px;
                    height: 22px;
                    vertical-align: middle;
                    margin-right: 1em;
                }

                div img {
                    width: 100%;
                    height: 100%;
                }
            `}
            </style>
    </div>
)

const contentStyle = css`
.Tile {
    grid-row-end: span 21;
}

.Tile__Content {
    display: block;
}`

const collectionStyle = css`
.Tile__Collection {
    width: 100%;
    letter-spacing: 0;
    font-family: 'Rubik';
    position: relative;
}

.Tile__Image {
    display: block;
    width: 100%;
    max-width: 280px;
    margin: auto;
    vertical-align: middle;
}

.Tile__Image img {
    display: table-cell;
    width: 100%;
}

.Tile__Details {
    width: 100%;
    background: rgba(22, 22, 22, 0.3);
    box-sizing: border-box;
    padding: 1em;
    position: absolute;
    bottom: 0;
}

.Tile__Details p {
    display: block;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 250px;
    margin: 0;
}

.Tile__Details__Name {
    font-weight: bold;
}

.Tile__Details__Artist {
    font-weight: 300;
}

.Tile__Details__Album {
    font-size: 14px;
    font-weight: light;
}
`