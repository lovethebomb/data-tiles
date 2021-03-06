import * as express from 'express';
import * as next from 'next';

const dev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000;
const app = next({ dev })
const handle = app.getRequestHandler()

import api = require('../api');
import config = require('../config');

app.prepare()
.then(() => {
  const server = express()
  server.use('/api/v1', api(config))

  // server.get('/p/:id', (req, res) => {
  //   const actualPage = '/post'
  //   const queryParams = { id: req.params.id } 
  //   app.render(req, res, actualPage, queryParams)
  // })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, (err) => {
    if (err) {
      throw err
    }
    console.log(`> Ready on http://localhost:${PORT} - ${dev ? 'dev' : process.env.NODE_ENV}`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

export {}