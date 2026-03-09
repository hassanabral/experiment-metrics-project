import express from 'express'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createServer() {
  const app = express()

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    root: path.resolve(__dirname, '../..'),
    server: { middlewareMode: true },
    appType: 'spa',
  })

  // Return serve function and app so main.ts can attach middleware before vite
  const serve = () => {
    // Use vite's connect instance as middleware (after API routes are registered)
    app.use(vite.middlewares)

    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  }

  return { serve, app }
}
