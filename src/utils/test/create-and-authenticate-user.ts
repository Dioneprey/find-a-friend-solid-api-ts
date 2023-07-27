import { hash } from 'bcryptjs'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { prisma } from 'src/lib/prisma'
import request from 'supertest'

export async function CreateAndAuthenticateUser(
  app: FastifyInstance,
  isOrg = false,
) {
  const randowId = await randomUUID()

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: `john.doe${randowId}@gmail.com`,
      password_hash: await hash('123456', 6),
      role: isOrg ? 'ORG' : 'USER',
    },
  })

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: `john.doe${randowId}@gmail.com`,
      password: '123456',
    })

  const { token } = authResponse.body

  return { token }
}
