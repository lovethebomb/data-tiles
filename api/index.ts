import apicache from 'apicache';
import express from 'express';
import morgan from 'morgan';
import Prometheus from 'prom-client'

import ServiceDiscogs from './discogs'
import ServiceGithub from './github';
import ServiceLastFm from './lastfm'
import ServiceOverwatch from './overwatch'
import ServicePUBG from './pubg'
import ServiceQuakeChampions from './quake'

const cache = apicache.middleware;
const DEFAULT_CACHE = "2 minutes"

Prometheus.collectDefaultMetrics()
const PrometheusMetrics = {
    cacheSize: new Prometheus.Gauge({
        help: 'The size of cached routes',
        name: 'cache_size'
    }),
    httpRequestDurationMicroseconds: new Prometheus.Histogram({
        buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500],
        help: 'Duration of HTTP requests in ms',
        labelNames: ['route'],
        name: 'http_request_duration_ms'
    }),
    requestCounter: new Prometheus.Counter({
        help: 'The number of requests served',
        name: 'throughput' 
    })
}

// Middlewares
function metricsStartMiddleware({ res, next }) {
    res.locals.startEpoch = Date.now()
    next()
}

function metricsMiddleware(req, res, next) {
    res.on('finish', () => {
        const responseTimeInMs = Date.now() - res.locals.startEpoch
        PrometheusMetrics.requestCounter.inc();
        PrometheusMetrics.httpRequestDurationMicroseconds
        .labels(req.url)
        .observe(responseTimeInMs);
      });
    next()
}

const apiRouter = (config) => {
    const api = express.Router();
    const github = new ServiceGithub();
    const lastfm = new ServiceLastFm({ apiKey: config.LASTFM_API_KEY });
    const discogs = new ServiceDiscogs({ apiKey: config.DISCOGS_API_KEY });
    const overwatch = new ServiceOverwatch();
    const pubg = new ServicePUBG({ apiKey: config.PUBG_API_KEY });
    const quakeChampions = new ServiceQuakeChampions();

    api.use(morgan('dev'));
    api.use(metricsStartMiddleware)

    // Services
    api.get('/github', metricsMiddleware, cache(DEFAULT_CACHE), async ({ res }) => {
        const query = await github.getLatestRepo(config.GITHUB_USERNAME);
        return res.status(query.status).json(query);
    });
    api.get('/lastfm', metricsMiddleware, cache(DEFAULT_CACHE), async ({ res }) => {
        const query = await lastfm.getLatestTrack(config.LASTFM_USERNAME)
        return res.status(query.status).json(query);
    });
    
    api.get('/discogs/collection', metricsMiddleware, cache(DEFAULT_CACHE), async ({ res }) => {
        const query = await discogs.getLastestCollectionItem(config.DISCOGS_USERNAME)
        return res.status(query.status).json(query);
    });

    api.get('/discogs/wantlist', metricsMiddleware, cache(DEFAULT_CACHE), async ({ res }) => {
        const query = await discogs.getWantlist(config.DISCOGS_USERNAME)
        return res.status(query.status).json(query);
    });

    api.get('/overwatch', metricsMiddleware, cache(DEFAULT_CACHE), async ({ res }) => {
        const query = await overwatch.getProfile(config.BATTLE_NET_USER)
        return res.status(query.status).json(query);
    });

    api.get('/pubg', metricsMiddleware, cache(DEFAULT_CACHE), async ({ res }) => {
        const query = await pubg.getLastGame(config.PUBG_PLAYER_ID)
        return res.status(query.status).json(query);
    });

    api.get('/quake', metricsMiddleware, cache(DEFAULT_CACHE), async ({ res }) => {
        const query = await quakeChampions.getProfile(config.QUAKE_CHAMPIONS_USERNAME)
        return res.status(query.status).json(query);
    });
    
    // Metrics
    api.get('/metrics', ({ res }) => {
        PrometheusMetrics.cacheSize.set(apicache.getIndex().all.length)
        res.set('Content-Type', Prometheus.register.contentType)
        res.end(Prometheus.register.metrics())
    })

    // API Cache
    api.get('/cache/index', ({ res }) => {
        res.send(apicache.getIndex());
    });

    api.get('/cache/clear/:key?', ({ req, res }) => {
        res.send(200, apicache.clear(req.params.key || req.query.key));
    });

    api.get('/', ({ res }) => {
        return res.json({
            message: "Hello world.",
            version: 1
        });
    });

    return api;
}

module.exports = apiRouter