import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().refine((value) => value.length >= 6, {
      message: 'Password must be at least 6 characters',
    }),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const { user }
  } catch (error) {}
}
