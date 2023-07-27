import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from 'src/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from 'src/use-cases/factories/make-register-use-case'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().refine((value) => value.length >= 6, {
      message: 'Password must be at least 6 characters',
    }),
    role: z.enum(['ORG', 'USER']),
  })

  const { name, email, password, role } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({
      name,
      email,
      password,
      role,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
