import { FastifyRequest, FastifyReply } from 'fastify'
import { ResourceNotFoundError } from 'src/use-cases/errors/resource-not-found-error'
import { makeFetchPetsByCityAndTraitsUseCase } from 'src/use-cases/factories/make-fetch-pets-by-city-and-traits-use-case'
import { z } from 'zod'

export async function fetchPetsByCityAndTraits(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchPetsBodySchema = z.object({
    city: z.string(),
    traits: z
      .object({
        age: z.number().optional(),
        animal: z.string().optional(),
        breed: z.string().optional(),
        color: z.string().optional(),
        size: z.enum(['SMALL', 'MID', 'LARGE']).optional(),
      })
      .optional(),
  })

  const { city, traits } = fetchPetsBodySchema.parse(request.body)

  const getPetDetailsUseCase = makeFetchPetsByCityAndTraitsUseCase()

  try {
    const { pets } = await getPetDetailsUseCase.execute({
      city,
      traits,
    })
    return reply.status(200).send({ pets })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
