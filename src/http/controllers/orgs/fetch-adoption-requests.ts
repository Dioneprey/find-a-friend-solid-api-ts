import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from 'src/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from 'src/use-cases/errors/resource-not-found-error'
import { makeFetchAdoptionRequestsUseCase } from 'src/use-cases/factories/make-fetch-adoption-request-use-case'
import { z } from 'zod'

export async function fetchAdoptionRequests(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAdoptionRequestParamsSchema = z.object({
    org_id: z.string(),
  })

  const { org_id } = fetchAdoptionRequestParamsSchema.parse(request.params)

  const fetchAdoptionRequestsUseCase = makeFetchAdoptionRequestsUseCase()

  try {
    const { adoptionRequests } = await fetchAdoptionRequestsUseCase.execute({
      org_id,
      user_id: request.user.sub,
    })
    return reply.status(200).send(adoptionRequests)
  } catch (error) {
    if (
      error instanceof ResourceNotFoundError ||
      error instanceof InvalidCredentialsError
    ) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
