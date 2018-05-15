import React from 'react';
import css from 'styled-jsx/css'
import { TransitionGroup } from 'react-transition-group'
import ease from 'css-ease';

import ServiceDiscogs from '../../../lib/discogs-service';
import { resolveScopedStyles }  from '../../../lib/styled-jsx';
import Tile from '../Tile';
import TileContent from '../TileContent';
import TileHeader from '../TileHeader';
import FadeIn from '../../Transition/FadeIn';

export interface TileDiscogsProps {
    username: string;
    apiKey: string;
}

export interface TileDiscogsState {
    isLoaded: boolean;
    collection: any;
    wantlist: any;
}

export default class TileDiscogs extends React.Component<TileDiscogsProps, TileDiscogsState> {
    public state = {
        collection: {},
        isLoaded: false,
        wantlist: {}
    }

    private service = new ServiceDiscogs(this.props.apiKey);

    async getLatestCollectionItem() {
        const res = await this.service.getLastestCollectionItem('ltb_lucas');
        return res.releases[0];
    }

    async getLatestWantlistItem() {
        const res = await this.service.getLatestWanted('ltb_lucas');
        return res.wants[0];
    }

    async componentDidMount() {
        const lastCollectionItem = await this.getLatestCollectionItem();
        const lastWantlistItem = await this.getLatestWantlistItem();

        const artistsString = lastCollectionItem.basic_information.artists.map( artist => artist.name).join(', ');
        const descriptions = lastCollectionItem.basic_information.formats[0].descriptions.join(' ');
        const quantity = lastCollectionItem.basic_information.formats[0].qty; 

        const formatsString = `${lastCollectionItem.basic_information.formats[0].name} - ${quantity > 1 ? `${quantity}x` : ''}${descriptions}`

        const collection = {
            album: lastCollectionItem.basic_information.title,
            artists: lastCollectionItem.basic_information.artists,
            artistsString,
            format: lastCollectionItem.basic_information.formats[0],
            formatsString,
            image: lastCollectionItem.basic_information.cover_image,
        }

        const wantlist = {
            album: lastWantlistItem.basic_information.title,
            artists: lastWantlistItem.basic_information.artists,
            formats: lastWantlistItem.basic_information.formats,
            image: lastWantlistItem.basic_information.cover_image,
        }
        const isLoaded = true;
    
        return this.setState(Object.assign({}, this.state, {
            isLoaded,
            collection,
            wantlist
        }));
    }

    render() {
        const headerLink = "https://www.discogs.com/developers";
        const headerTitle = "Discogs API";
        const containerClasses = [
            'Tile--TileDiscogs',
            this.state.isLoaded ? 'is-loaded' : ''
        ]
        const detailsCollection = [
            { className: "Tile__Details__Name", detail: this.state.collection.album },
            { className: "Tile__Details__Artist", detail: this.state.collection.artistsString },
            { className: "Tile__Details__Album", detail: this.state.collection.formatsString }
        ];


        const scoped = resolveScopedStyles(
            <scope>
                <style jsx>{contentStyle}</style>
            </scope>
        )

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
                    {/* <div className="Tile__Image">
                        <img src={this.state.collection.image} className="value" />
                    </div>
                    <TileDetails details={detailsCollection} isLoaded={this.state.isLoaded} /> */}
                    {/* <div className="Tile__Image">
                        <img src={this.state.wantlist.image} className="value" />
                    </div>
                    <TileDetails details={detailsWantlist} isLoaded={this.state.isLoaded} /> */}
                </TileContent>
                <style jsx>{contentStyle}</style>
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
        <style jsx>{collectionStyle}</style>
    </div>
)

const Logo = () => (
    <div className="icon">
        <img src="/static/img/discogs/discogs-white.png" />
        <style jsx>{`
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
    width: 280px;
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