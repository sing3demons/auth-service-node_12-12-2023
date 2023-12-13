'use strict'
import express, { Application } from 'express'
import Auth from './auth.js'
import KafkaNode from './kafka.js'
import Response from './response.js'
import Hash from './hash.js'

class Server {
  private app: Application
  constructor() {
    this.app = express()
    this.config()
    this.routes()
  }
  config() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }
  routes = () => Router(this.app)

  startHttp = () => {
    const port = process.env.PORT || 3000
    const server = this.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })

    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server')
      server.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
      })
    })

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server')
      server.close(() => {
        console.log('HTTP server closed')
        process.exit(0)
      })
    }); 
  }
}

function Router(app: Application) {
  app.get('/', async (req, res) => {
    const pass = await Hash.hashPassword('123456')
    console.log(pass)
    const body = {
      userId: '123456789',
      role: 'admin',
      sub: '123456789',
      username: 'test'
    }
    const token = Auth.generateToken(body)
    res.json({ token })
  })

  app.get('/verify', Auth.verifyToken, (req, res) => {
    const user = Auth.getUser(req)
    const body = { ...user }

    KafkaNode.sendMsg('test', req.headers, body)
    res.json(Response.success(user, 'Success'))
  })
}

export default Server
