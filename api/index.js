const express = require('express');
const morgan = require('morgan');
const apicache = require('apicache');
const cache = apicache.middleware;
const Prometheus = require('prom-client')


const ServiceGithub = require('./github')
const ServiceLastFm = require('./lastfm')
const ServiceDiscogs = require('./discogs')
const ServiceOverwatch = require('./overwatch')
const ServicePUBG = require('./pubg')

const DEFAULT_CACHE = "2 minutes"
const metricsInterval = Prometheus.collectDefaultMetrics()
const PrometheusMetrics = {
    requestCounter: new Prometheus.Counter({
        name: 'throughput', 
        help: 'The number of requests served'
    }),
    cacheSize: new Prometheus.Gauge({
        name: 'cache_size', 
        help: 'The size of cached routes'
    }),
    httpRequestDurationMicroseconds: new Prometheus.Histogram({
        name: 'http_request_duration_ms',
        help: 'Duration of HTTP requests in ms',
        labelNames: ['route'],
        buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
    })
}

// Middlewares
function metricsStartMiddleware(req, res, next) {
    res.locals.startEpoch = Date.now()
    next()
}

function metricsMiddleware(req, res, next) {
    res.on('finish', function(){
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
    
    // Metrics
    api.get('/metrics', (req, res) => {
        PrometheusMetrics.cacheSize.set(apicache.getIndex().all.length)
        res.set('Content-Type', Prometheus.register.contentType)
        res.end(Prometheus.register.metrics())
    })

    // API Cache
    api.get('/cache/index', function (req, res, next) {
        res.send(apicache.getIndex());
    });

    api.get('/cache/clear/:key?', function (req, res, next) {
        res.send(200, apicache.clear(req.params.key || req.query.key));
    });

    api.get('/', (req, res) => {
        return res.json({
            version: 1,
            message: "Hello world."
        });
    });

    return api;
}

module.exports = apiRouter