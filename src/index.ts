'use strict'
import dotenv from 'dotenv'
import KafkaNode from './kafka.js'
import Server from './server.js'
dotenv.config()

function main() {
  const topics = ['test']
  KafkaNode.startConsumer(topics)
  const app = new Server()
  app.startHttp()
}
main()
