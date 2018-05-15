import React from 'react';
import css from 'styled-jsx/css'

import ServicePUBG from '../../../lib/pubg-service';
import { resolveScopedStyles }  from '../../../lib/styled-jsx';
import Tile from '../Tile';
import TileContent from '../TileContent';
import TileHeader from '../TileHeader';

export interface TilePUBGProps {
    playerId: string;
    apiKey: string;
}

export interface TilePUBGState {
    damageDealt: number;
    duration: number;
    isLoaded: boolean;
    kills: number;
    lastMatch: any;
    longestKill: number;
    name: string;
    player: any;
    timeSurvived: number;
    walkDistance: number;
    winPlace: number;
}

export default class TilePUBG extends React.Component<TilePUBGProps, TilePUBGState> {
    public state = {
        damageDealt: 0,
        duration: 0,
        isLoaded: false,
        kills: 0,
        lastMatch: {},
        longestKill: 0,
        name: '',
        player: {},
        timeSurvived: 0,
        walkDistance: 0,
        winPlace: 0
    }

    private service = new ServicePUBG(this.props.apiKey);

    async componentDidMount() {
        const player = await this.service.getPlayer(this.props.playerId);
        const lastMatchId = this.service.getPlayerLastMatch(player).id;
        const lastMatch = await this.service.getMatch(lastMatchId);
        const participants = this.service.getParticipants(lastMatch);
        const playerParticipant = this.service.getParticipant(participants, this.props.playerId)
        const { damageDealt, kills, longestKill, walkDistance, timeSurvived, winPlace} = playerParticipant.attributes.stats;
        const duration = ~~(timeSurvived / 60);
        const isLoaded = true;
    
        return this.setState(Object.assign({}, this.state, {
            damageDealt,
            duration,
            isLoaded,
            kills,
            lastMatch,
            longestKill,
            name: player.attributes.name,
            player,
            timeSurvived,
            walkDistance,
            winPlace
        }));
    }

    render() {
        const headerLink = "https://developer.playbattlegrounds.com";
        const headerTitle = "PUBG API";
        const containerClasses = [
            'Tile--TilePUBG',
            'has-animation',
            this.state.isLoaded ? 'is-loaded' : ''
        ]

        const scoped = resolveScopedStyles(
            <scope>
                <style jsx>{headerStyle}</style>
            </scope>
        )
        
        const details = [
            { title: "Rank", value: this.state.winPlace, className: 'Tile__Rank' },
            { title: "Kills", value: this.state.kills, className: 'Tile__Kills' },
            { title: "DMG", value: ~~this.state.damageDealth, className: 'Tile__Damage' },
            { title: "LGT", value: `${~~this.state.longestKill}m`, className: 'Tile__LongestKill' },
            { title: "DST", value: `${~~this.state.walkDistance}m`, className: 'Tile__Distance' },
            { title: "DUR", value: `${~~this.state.duration}mn`, className: 'Tile__Survived' },
        ];
        const items = details.map(item => 
            <Item key={item.title} className={item.className} title={item.title} value={item.value} />
        );


        return (
            <Tile containerClass={containerClasses.join(' ')} visible={this.state.isLoaded}>
                <TileHeader className={scoped.className}>
                    <a className="Tile__Header__Logo" href={headerLink} title={headerTitle} target="_blank" rel="noopener">
                        {headerTitle}
                    </a>
                    <span className="Tile__Header__TimeAgo">Lastest game</span>
                </TileHeader>
                <TileContent className={scoped.className}>
                    { items}
                </TileContent>
                <style jsx>{headerStyle}</style>
            </Tile>
        )
    }
}

const Item = ({className, title, value}) => (
    <p className={className}>
        <span className="title">{title}</span>
        <span className="value">{value}</span>
        <style jsx>{itemStyle}</style>
    </p>
)

const headerStyle = css`
.Tile__Header__Logo {
    display: block;
    width: 128px;
    height: 27px;
    background-image: url('/static/img/pubg/header_logo.png');
    background-repeat: no-repeat;
    background-size: 100%;
    text-indent: -9999px;
    overflow: hidden;
}
`

const itemStyle = css`
p {
    display: inline-block;
    margin: 0 0.4em;
    vertical-align: middle:
}

.title {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
}

.value {
    display: inline-block;
    font-family: monospace;
}

.Tile__Rank .value {
    font-weight: bold;
    color: lightskyblue;
    font-size: 24px;
}`