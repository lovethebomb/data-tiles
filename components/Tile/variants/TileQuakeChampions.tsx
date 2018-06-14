import React from 'react';
import css from 'styled-jsx/css'

import { resolveScopedStyles }  from '../../../lib/styled-jsx';
import Tile from '../Tile';
import TileContent from '../TileContent';
import TileHeader from '../TileHeader';

export interface TileQuakeChampionsState {
    isLoaded: boolean;
    profile: object;
    level: number;
    icon: string;
    nameplate: string;
    duelRating: number;
    tdmRating: number;
    latestMatch: object;
}


export default class TileQuakeChampions extends React.Component<TileQuakeChampionsState> {
    public state = {
        isLoaded: false,
        profile: {},
        level: 0,
        icon: "",
        nameplate: "",
        duelRating: 0,
        tdmRating: 0,
        latestMatch: {
            won: false,
            score: []
        }
    }

    public async getInitialData() {
        const res = await fetch('/api/v1/quake');
        return res.json();
    }

    public async componentDidMount() {
        const data = await this.getInitialData();
        const profile = data.data.player;
        const latestMatch = data.data.latestMatch;
        const level = profile.playerLevelState.level;
        const icon = profile.playerLoadOut.iconId;
        const nameplate = profile.playerLoadOut.namePlateId;
        const duelRating = profile.playerRatings.duel.rating;
        const tdmRating = profile.playerRatings.tdm.rating;
        const isLoaded = true;
    
        return this.setState(Object.assign({}, this.state, {
            isLoaded,
            profile,
            icon,
            nameplate,
            level,
            duelRating,
            tdmRating,
            latestMatch,
        }));
    }

    public render() {
        const headerLink = "https://stats.quake.com";
        const headerTitle = "Quake Champions API";
        const scoped = resolveScopedStyles(
            <scope>
                <style jsx>{contentStyle}</style>
            </scope>
        )

        const containerClasses = [
            'Tile--TileQuakeChampions',
            scoped.className,
            this.state.isLoaded ? 'is-loaded' : ''
        ]

        return (
            <Tile containerClass={containerClasses.join(' ')} visible={this.state.isLoaded}>
                <TileHeader className={scoped.className}>
                    <a className="Tile__Header__Logo" href={headerLink} title={headerTitle} target="_blank" rel="noopener">
                        <Logo />
                    </a>
                    <span className="Tile__Header__TimeAgo">Season Stats</span>
                </TileHeader>
                <TileContent className={scoped.className}>
                    <TileDetails
                        icon={this.state.icon}
                        nameplate={this.state.nameplate}
                        level={this.state.level}
                        duelRating={this.state.duelRating}
                        tdmRating={this.state.tdmRating}
                        latestMatch={this.state.latestMatch}
                         />
                </TileContent>
                <style jsx>{contentStyle}</style>
            </Tile>
        )
    }
}

const Logo = () => (
    <div className="icon">
        <img width="26" height="26" src="/static/img/quake/quake-logo-redux.svg" />
        <style jsx>{`
                div {
                    display: inline-block;
                    width: 68px;
                    height: 20px;
                    vertical-align: middle;
                    margin-right: 1em;
                }

                div svg {
                    width: 100%;
                    height: 100%;
                    fill: #fff;
                }
            `}
            </style>
    </div>
)

const TileDetails = ({ icon, nameplate, level, duelRating, tdmRating, latestMatch }) => {
    const items = [
        { className: 'Level', title: 'LVL', tooltip: 'Level', value: level },
        { className: 'Duel Rating', title: 'Duel SR', tooltip: 'Duel Skill Rating', value: duelRating },
        { className: '2v2 Rating', title: '2v2 SR', tooltip: '2v2 Skill Rating', value: tdmRating },
    ];

    icon = `https://stats.quake.com/icons/${icon}.png`;
    return (
        <div className="Tile__Details">
            <div className="Tile__Image">
                <img src={icon} className="value" />
            </div>
            <div className="Tile__Content">
                <dl>
                    {items.map(item => (
                        <div className={item.className} key={item.className}>
                            <dt className="title">{item.title}</dt>
                            <dt className="tooltip">{item.tooltip}</dt>
                            <dd className="value">{item.value}</dd>
                        </div>
                    ))}
                </dl>
                <LatestGame latestMatch={latestMatch} />
            </div>
            <style jsx>{detailStyle}</style>
            <style jsx>{`
            .Tile__Details {
                background-image: url(https://stats.quake.com/nameplates/${nameplate}.png), url(https://stats.quake.com/nameplates/nameplate_default.png);
                background-repeat: no-repeat;
            }`}</style>
        </div>
    )
}

const LatestGame = ({ latestMatch }) => {
    const scoreClass = `LatestGame__Score ${latestMatch.won ? 'is-won' : 'is-lost'}`;
    return (
    <div className="LatestGame" >
        <span className="LatestGame__Title">Last</span>&nbsp;
        <span className="LatestGame__GameMode">{latestMatch.gameMode}</span>&nbsp;
        <span className={scoreClass}>{latestMatch.score.join(' - ')}</span>
        <style jsx>{`
        .LatestGame {
            font-size: 12px;
            margin: 0 0.5em;
        }

        .LatestGame span {
            margin: 0 0.5em;
            display: inline-block;
        }

        .LatestGame span:first-of-type, .LatestGame span:last-of-type {
            margin-left: 0;
        }

        .LatestGame__Title {
            text-transform: uppercase;
        }

        .LatestGame__GameMode {
            text-transform: lowercase;
            font-family: monospace;
            font-weight: bold;
            min-width: 48px;
        }

        .LatestGame__Score {
            font-size: 14px;
            font-family: monospace;
            font-weight: bold;
        }

        .LatestGame__Score.is-won {
            color: lightgreen;
        }

        .LatestGame__Score.is-lost {
            color: lightcoral;
        }
        `}</style>
    </div>
    )
}

const detailStyle = css`
.Tile__Details {
    display: flex;
    width: 100%;
    flex: 1 1 auto;
    padding: 0;
    letter-spacing: 0;
    font-family: 'Rubik';
    position: relative;
    flex-wrap: row wrap;
}

.Tile__Image {
    flex: 0 0 56px;
    width: 100%;
    height: 100%;
}

.Tile__Image img {
    margin: 10px;
}

.Tile__Content {
    padding-top: 10px;
}

.Tile__Content dl {
    width: 100%;
    flex: 0 0 auto;
    margin: 0;
}

.Tile__Content dl dd {
    margin: 0;
}

.Tile__Content dl div {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0.5em;
}

.Tile__Content .title {
    font-size: 12px;
    text-transform: uppercase;
}

.Tile__Content .value {
    font-family: monospace;
}

.Tile__Content .tooltip {
    visibility: hidden;
    display: none;
}

`

const contentStyle = css`
.Tile { 
    height: 180px;
}

.Tile__Content {
    display: block;
    padding-top: 0;
}
`
