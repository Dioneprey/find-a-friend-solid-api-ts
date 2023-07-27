import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'USER' | 'ORG') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()

      const { role } = request.user
      if (role !== roleToVerify) {
        return reply.status(401).send({ message: 'Unauthorized.' })
      }
    } catch (error) {
      console.log(error)
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
