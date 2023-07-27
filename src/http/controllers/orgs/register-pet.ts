import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from 'src/use-cases/errors/invalid-credentials-error'
import { OrgAccountRequired } from 'src/use-cases/errors/org-account-required-error'
import { makeRegisterPetUseCase } from 'src/use-cases/factories/make-register-pet-use-case'
import { z } from 'zod'

export async function registerPet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createOrgBodySchema = z.object({
    name: z.string(),
    age: z.number(),
    animal: z.string(),
    breed: z.string(),
    color: z.string(),
    size: z.enum(['SMALL', 'MID', 'LARGE']),
    org_id: z.string(),
  })

  const { name, age, animal, breed, color, size, org_id } =
    createOrgBodySchema.parse(request.body)

  const registerPetUseCase = makeRegisterPetUseCase()

  try {
    const { pet } = await registerPetUseCase.execute({
      name,
      age,
      animal,
      breed,
      color,
      size,
      org_id,
      user_id: request.user.sub,
    })
    return reply.status(201).send({
      pet: pet.id,
    })
  } catch (error) {
    if (
      error instanceof OrgAccountRequired ||
      error instanceof InvalidCredentialsError
    ) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
