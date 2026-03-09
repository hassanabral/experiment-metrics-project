import { createServer } from './vite-server'
import bodyParser from 'body-parser'

import { api } from './api'

const start = async () => {
  const { serve, app } = await createServer();

  app.use(bodyParser.json());
  app.use('/api', api);

  serve()
}

start();
