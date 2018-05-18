import formatDistance from 'date-fns/formatDistance'
import toDate from 'date-fns/toDate'
import React from 'react';
import css from 'styled-jsx/css'

import parsePrometheusTextFormat from 'parse-prometheus-text-format';
import { resolveScopedStyles }  from '../../../lib/styled-jsx';
import Tile from '../Tile';
import TileContent from '../TileContent';
import TileHeader from '../TileHeader';


export interface TileMetricsState {
    isLoaded: boolean;
    uptime: number;
    activeRequests: number;
    nodeVersion: string;
    apiRequestsServer: number;
    memory: number;
    apiCacheSize: number;
    requestsDuration: any;
    requestsDurationAvg: number;
}

export default class TileMetrics extends React.Component<{}, TileMetricsState> {
    public state = {
        isLoaded: false,
        uptime: 0,
        activeRequests: 0,
        nodeVersion: "--",
        apiRequestsServer: 0,
        memory: 0,
        apiCacheSize: 0,
        requestsDuration: {},
        requestsDurationAvg: 0,
    }

    public getMetric(metrics, name) {
        return metrics.filter(item => item.name === name)[0];
    }

    public async getInitialData() {
        const res = await fetch('/api/v1/metrics');
        const text = await res.text();
        return parsePrometheusTextFormat(text)
    }

    public averageDuration(requests) {
        const metrics = [];
        for(const duration in requests) {
            if (duration ==="+Inf") {
                continue;
            }
             for(let i = 0, l = requests[duration]; i < l; i++) {
                 metrics.push(~~duration)
            }
        }
        if (metrics.length > 0) {
            const sum = metrics.reduce((a, b) => a + b);
            return ~~(sum/metrics.length);
        }
        return 0
    }

   
    public async componentDidMount() {
        const data = await this.getInitialData();
        const uptime = this.getMetric(data, "process_start_time_seconds").metrics[0].value;
        const activeRequests = this.getMetric(data, "nodejs_active_requests_total").metrics[0].value;
        const nodeVersion = this.getMetric(data, "nodejs_version_info").metrics[0].labels.version;
        const apiRequestsServer = this.getMetric(data, "throughput").metrics[0].value;
        const apiCacheSize = this.getMetric(data, "cache_size").metrics[0].value;
        const requestsDuration = this.getMetric(data, "http_request_duration_ms").metrics;
        const requestsDurationAvg = (requestsDuration.length > 0 ? this.averageDuration(requestsDuration[0].buckets) : '--');
        const memory = this.getMetric(data, "nodejs_external_memory_bytes").metrics[0].value;
        const isLoaded = true;
    
        return this.setState(Object.assign({}, this.state, {
            isLoaded,
            uptime,
            activeRequests,
            nodeVersion,
            memory,
            apiRequestsServer,
            apiCacheSize,
            requestsDuration,
            requestsDurationAvg,
        }));
    }

    render() {
        const headerLink = "https://developer.github.com";
        const headerTitle = "Github API";
        const containerClasses = [
            'Tile--TileMetrics',
            this.state.isLoaded ? 'is-loaded' : ''
        ]

        const scoped = resolveScopedStyles(
            <scope>
                <style jsx>{contentStyle}</style>
            </scope>
        )

        const now = new Date();
        const uptime = toDate(~~this.state.uptime*1000);
        const timeAgo = formatDistance(now, uptime)
        const memory = ~~(this.state.memory / 1024 / 1024)

        const items = [
            { className: 'ActiveRequests', title: 'Req', value: this.state.activeRequests },
            { className: 'ApiRequestsServer', title: 'API Req', value: this.state.apiRequestsServer },
            { className: 'ApiRequestsDurationAvg', title: 'DUR AVG', value: `${this.state.requestsDurationAvg}ms` },
            { className: 'ApiCacheSize', title: 'Cached', value: this.state.apiCacheSize },
            { className: 'Memory', title: 'Mem', value: `${memory}MB` },
            { className: 'Uptime', title: 'Up', value: `${timeAgo} ago` },
            { className: 'NodeVersion', title: 'Node', value: this.state.nodeVersion },
        ]

        return (
            <Tile containerClass={containerClasses.join(' ')} visible={this.state.isLoaded}>
                <TileHeader className={scoped.className}>
                    <a className="Tile__Header__Logo" href={headerLink} title={headerTitle} target="_blank" rel="noopener">
                        <Logo />
                    </a>
                    <span className="Tile__Header__TimeAgo">Lastest metrics</span>
                </TileHeader>
                <TileContent className={scoped.className}>
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
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 432 432" enableBackground="new 0 0 432 432">
            <g>
                <path fill="#E75225" d="M215.926,7.068c115.684,0.024,210.638,93.784,210.493,207.844
                    c-0.148,115.793-94.713,208.252-212.912,208.169C97.95,423,4.52,329.143,4.601,213.221C4.68,99.867,99.833,7.044,215.926,7.068z
                    M151.979,80.069c2.652,12.978,0.076,25.082-3.846,36.988c-2.716,8.244-6.47,16.183-8.711,24.539
                    c-3.694,13.769-7.885,27.619-9.422,41.701c-2.21,20.25,5.795,38.086,19.493,55.822c-22.25-4.657-42.428-8.88-62.966-13.179
                    c0.11,1.978-0.007,2.727,0.21,3.361c5.968,17.43,16.471,32.115,28.243,45.957c1.246,1.465,4.082,2.217,6.182,2.221
                    c62.782,0.115,125.565,0.109,188.347,0.028c1.948-0.003,4.546-0.369,5.741-1.618c13.456-14.063,23.746-30.079,30.179-50.257
                    c-23.061,4.489-44.893,8.739-66.658,12.976c4.397-8.567,9.417-16.1,12.302-24.377c9.869-28.315,5.779-55.69-8.387-81.509
                    c-11.368-20.72-21.854-41.349-16.183-66.32c-12.005,11.786-16.615,26.79-19.541,42.253c-2.882,15.23-4.58,30.684-6.811,46.136
                    c-0.317-0.467-0.728-0.811-0.792-1.212c-0.258-1.621-0.499-3.255-0.587-4.893c-1.355-25.31-6.328-49.696-16.823-72.987
                    c-6.178-13.71-12.99-27.727-6.622-44.081c-4.31,2.259-8.205,4.505-10.997,7.711c-8.333,9.569-11.779,21.062-12.666,33.645
                    c-0.757,10.75-1.796,21.552-3.801,32.123c-2.107,11.109-5.448,21.998-12.956,32.209C171.874,115.496,171.537,93.926,151.979,80.069
                    z M313.856,296.592c-66.229,0-131.466,0-196.914,0c0,11.661,0,22.809,0,34.007c65.932,0,131.376,0,196.914,0
                    C313.856,319.012,313.856,308.028,313.856,296.592z M155.985,348.167c-0.163,28.317,28.851,49.414,64.709,47.883
                    c29.716-1.269,56.016-24.51,53.755-47.883C235.127,348.167,195.77,348.167,155.985,348.167z"/>
            </g>
        </svg>
        <style jsx>{`
                div {
                    display: inline-block;
                    width: 30px;
                    vertical-align: middle;
                    margin-right: 1em;
                }

                div svg {
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