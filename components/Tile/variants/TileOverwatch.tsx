import React from 'react';
import css from 'styled-jsx/css'

import { resolveScopedStyles }  from '../../../lib/styled-jsx';
import Tile from '../Tile';
import TileContent from '../TileContent';
import TileHeader from '../TileHeader';

export interface TileOverwatchProps {
    username: string;
}

export interface TileOverwatchState {
    isLoaded: boolean;
    profile: any;
    level: number;
    icon: string;
    rating: string;
    cpWon: number;
cpPlayed: number;
    damageDoneAvg: number;
    eliminationsAvg: number;
    deathAvg: number;
}


export default class TileOverwatch extends React.Component<TileOverwatchProps, TileOverwatchState> {
    public state = {
        isLoaded: false,
        profile: {},
        level: 0,
        icon: "",
        rating: "--",
        cpWon: 0,
        cpPlayed: 0,
        damageDoneAvg: 0,
        eliminationsAvg: 0,
        deathAvg: 0
    }

    public async getInitialData() {
        const res = await fetch('/api/v1/overwatch');
        return res.json();
    }

    public async componentDidMount() {
        const data = await this.getInitialData();
        const profile = data.data;
        const icon = profile.icon
        const level = `${profile.prestige}${profile.level}`
        const rating = `${profile.rating === "" ? "--" : profile.rating}`
        const cpWon = profile.competitiveStats.games.won;
        const cpPlayed = profile.competitiveStats.games.played;
        const damageDoneAvg = profile.competitiveStats.damageDoneAvg
        const eliminationsAvg = profile.competitiveStats.eliminationsAvg
        const deathAvg = profile.competitiveStats.deathsAvg
        const isLoaded = true;
    
        return this.setState(Object.assign({}, this.state, {
            isLoaded,
            profile,
            level,
            icon,
            rating,
            cpWon,
            cpPlayed,
            damageDoneAvg,
            eliminationsAvg,
            deathAvg
        }));
    }

    public render() {
        const headerLink = "https://ow-api.com/docs/";
        const headerTitle = "OW API";
        const scoped = resolveScopedStyles(
            <scope>
                <style jsx>{contentStyle}</style>
            </scope>
        )

        const containerClasses = [
            'Tile--TileOverwatch',
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
                        level={this.state.level}
                        rating={this.state.rating}
                        won={this.state.cpWon}
                        played={this.state.cpPlayed}
                        damageDoneAvg={this.state.damageDoneAvg}
                        eliminiationsAvg={this.state.eliminationsAvg}
                        deathsAvg={0} />
                </TileContent>
                <style jsx>{contentStyle}</style>
            </Tile>
        )
    }
}

const Logo = () => (
    <div className="icon">
        <img width="26" height="26" src="/static/img/overwatch/Overwatch_circle_logo.svg" />
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
                    fill: #D51007;
                }
            `}
            </style>
    </div>
)

const TileDetails = ({ icon, level, rating, won, played, damageDoneAvg, eliminiationsAvg, deathsAvg }) => {
    const items = [
        { className: 'Rating', title: 'SR', tooltip: 'Skill Rating', value: rating },
        { className: 'Won', title: 'Won', tooltip: 'CP Games Won', value: won },
        { className: 'Played', title: 'Played', tooltip: 'CP Games Played', value: played },
        { className: 'DamageDone', title: 'DMG', tooltip: 'Damage Done Average', value: damageDoneAvg },
        { className: 'Eliminations', title: 'Elims', tooltip: 'Eliminations Average', value: eliminiationsAvg },
        { className: 'Deaths', title: 'Deaths', tooltip: 'Deaths Average', value: deathsAvg },
    ]
    return (
        <div className="Tile__Details">
            <div className="Tile__Image">
                <img src={icon} className="value" />
                <span className="Level">{level}</span>
            </div>
            <dl>
                {items.map(item => (
                    <div className={item.className} key={item.className}>
                        <dt className="title">{item.title}</dt>
                        <dt className="tooltip">{item.tooltip}</dt>
                        <dd className="value">{item.value}</dd>
                    </div>
                ))}
            </dl>
            <style jsx>{detailStyle}</style>
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
}

.Tile__Image {
    display: block;
    width: 64px;
    height: 64px;
    background: grey;
    flex: 0 0 64px;
    position: relative;
}

.Tile__Image img {
    width: 100%;
    height: 100%;
}

.Tile__Image .Level {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 0.5em;
    background: #3f3f3f;
    font-size: 12px;
    letter-spacing: 0.1em;
    font-weight: bold;
}

.Tile__Details dl {
    margin: 0 1em;
}

.Tile__Details dl dd {
    margin: 0;
}

.Tile__Details dl div {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0.5em;
}

.Tile__Details .title {
    font-size: 12px;
    text-transform: uppercase;
}

.Tile__Details .value {
    font-family: monospace;
}

.Tile__Details .tooltip {
    visibility: hidden;
    display: none;
}
`

const contentStyle = css`
.Tile { 
    height: 180px;
    grid-row-end: span 10;
}

.Tile__Content {
    display: block;
}
`
