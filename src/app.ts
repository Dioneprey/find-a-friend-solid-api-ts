import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'

export const app = fastify()

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool
  }

  return reply.status(500).send({ message: 'Internal Server Error.' })
})

app.get('/', (request, reply) => {
  return reply.status(200).send({ message: 'Find a friend API' })
})
