'use strict'
import express, { Application } from 'express'
import Auth from './auth.js'
import KafkaNode from './kafka.js'
import Response from './response.js'

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
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }
}

function Router(app: Application) {
  app.get('/', (req, res) => {
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
