'use strict'
import express, { Application } from 'express'
import Auth from './auth.js'
import dotenv from 'dotenv'
import Response from './response.js'
import Payload from './payload.js'
dotenv.config()

const app: Application = express()

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

 const headers =  req.headers
  const user = Auth.getUser(req)
  const body = {...user}
  const payload = Payload.set(headers, body)
  console.log(payload)
  res.json(Response.success(user, 'Success'))
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

