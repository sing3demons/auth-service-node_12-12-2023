import { EachMessagePayload } from "kafkajs"

export async function consumeEventMessage({
    topic,
    message,
    partition
  }: EachMessagePayload) {
    console.log('=====================================>')
    console.log('Topic: ', topic)
    console.log('Partition: ', partition)
    console.log('Message: ', message?.value?.toString())

    switch (topic) {
        case 'test':
            // do something
            break
        default:
            break
    }
  }
