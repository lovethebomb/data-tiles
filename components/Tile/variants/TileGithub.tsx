import React from 'react';
import css from 'styled-jsx/css'
import { TransitionGroup } from 'react-transition-group'
import ease from 'css-ease';
import formatDistance from 'date-fns/formatDistance'

import ServiceGithub from '../../../lib/github-service';
import { resolveScopedStyles }  from '../../../lib/styled-jsx';
import Tile from '../Tile';
import TileContent from '../TileContent';
import TileHeader from '../TileHeader';
import FadeIn from '../../Transition/FadeIn';

export interface TileGithubProps {
    username: string;
}

export interface TileGithubState {
    isLoaded: boolean;
    repository: object;
    license: string;
    name: string;
    openIssues: number;
    forks: number;
    stargazers: number;
    language: string;
    url: string;
    description: string;
    pushedAt: string;
}

export default class TileGithub extends React.Component<TileGithubProps, TileGithubState> {
    public state = {
        isLoaded: false,
        repository: {},
        license: "",
        name: "",
        openIssues: 0,
        forks: 0,
        stargazers: 0,
        language: "",
        url: "",
        description: "",
        pushedAt: ""
    }

    async getInitialData() {
        const res = await fetch('/api/v1/github');
        return res.json();
    }

    async componentDidMount() {
        // const repository = await this.service.getLatestRepo(this.props.username);
        const repository = await this.getInitialData();
        const license = repository.license.spdx_id;
        const name = repository.name;
        const openIssues = repository.open_issues;
        const forks = repository.forks_count;
        const stargazers = repository.stargazers_count;
        const language = repository.language;
        const url = repository.clone_url;
        const description = repository.description;
        const pushedAt = repository.pushed_at;

        const isLoaded = true;
    
        return this.setState(Object.assign({}, this.state, {
            isLoaded,
            repository,
            license,
            name,
            openIssues,
            forks,
            stargazers,
            language,
            url,
            description,
            pushedAt
        }));
    }

    render() {
        const headerLink = "https://developer.github.com";
        const headerTitle = "Github API";
        const containerClasses = [
            'Tile--TileGithub',
            this.state.isLoaded ? 'is-loaded' : ''
        ]

        const scoped = resolveScopedStyles(
            <scope>
                <style jsx>{contentStyle}</style>
            </scope>
        )

        const now = new Date();
        const timeAgo = formatDistance(now, this.state.pushedAt)

        const items = [
            { className: 'Forks', title: 'Forks', value: this.state.forks },
            { className: 'Stars', title: 'Stars', value: this.state.stargazers },
            { className: 'OpenIssues', title: 'Open Issues', value: this.state.openIssues },
            { className: 'Licence', title: 'Licence', value: this.state.license },
            { className: 'Pushed', title: 'Last Commit Pushed', value: `${timeAgo} ago` },
        ]

        return (
            <Tile containerClass={containerClasses.join(' ')} visible={this.state.isLoaded}>
                <TileHeader className={scoped.className}>
                    <a className="Tile__Header__Logo" href={headerLink} title={headerTitle} target="_blank" rel="noopener">
                        <Logo />
                    </a>
                    <span className="Tile__Header__TimeAgo">Lastest repo</span>
                </TileHeader>
                <TileContent className={scoped.className}>
                    <p className="Name">
                        <a href={this.state.url} target="_blank" rel="noopener">{this.state.name}</a>
                    </p>
                    <p className="Description">{this.state.description}</p>
                    <p className="Language">{this.state.language}</p>
                    <dl>
                        {items.map(item => (
                            <div className={item.className} key={item.className}>
                                <dt className="title">{item.title}</dt>
                                <dd className="value">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </TileContent>
                <style jsx>{contentStyle}</style>
            </Tile>
        )
    }
}

const Logo = () => (
    <div className="icon">
        <img src="/static/img/github/Github_Logo_White.png" />
        <style jsx>{`
                div {
                    display: inline-block;
                    width: 64px;
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
    font-family: Rubik;
}

.Tile__Content .Name {
    margin-top: 0;
    font-weight: bold;
}

.Tile__Content .Description {
    font-size: 12px;
}

.Tile__Content .Language {
    font-size: 12px;
    color: lightblue;
}

.Tile__Content dl div.Pushed {
    display: block;
}

.Tile__Content dl {
}

.Tile__Content dl dd {
    margin: 0;
}

.Tile__Content dl div {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0.5em 0.5em 0;
}

.Tile__Content .title {
    font-size: 12px;
    text-transform: uppercase;
}

.Tile__Content .value {
    font-family: monospace;
}
`