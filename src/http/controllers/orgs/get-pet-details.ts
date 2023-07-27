import { FastifyRequest, FastifyReply } from 'fastify'
import { ResourceNotFoundError } from 'src/use-cases/errors/resource-not-found-error'
import { makeGetPetDetailsUseCase } from 'src/use-cases/factories/make-get-pet-details-use-case'
import { z } from 'zod'

export async function getPetDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createOrgParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = createOrgParamsSchema.parse(request.params)
  console.log(id)
  const getPetDetailsUseCase = makeGetPetDetailsUseCase()

  try {
    const { petDetails } = await getPetDetailsUseCase.execute({ id })
    return reply.status(200).send({
      petDetails,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
