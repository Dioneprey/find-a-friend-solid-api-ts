import { FastifyReply, FastifyRequest } from 'fastify'
import { ResourceNotFoundError } from 'src/use-cases/errors/resource-not-found-error'
import { makeCreateAdoptionPetRequestUseCase } from 'src/use-cases/factories/make-create-adoption-pet-request-use-case'
import { z } from 'zod'

export async function createAdoptionRequest(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBodySchema = z.object({
    pet_id: z.string(),
  })

  const { pet_id } = registerBodySchema.parse(request.body)

  try {
    const createAdoptionPetRequestUseCase =
      makeCreateAdoptionPetRequestUseCase()
    await createAdoptionPetRequestUseCase.execute({
      pet_id,
      user_id: request.user.sub,
    })

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
