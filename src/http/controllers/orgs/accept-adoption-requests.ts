import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from 'src/use-cases/errors/invalid-credentials-error'
import { ResourceNotFoundError } from 'src/use-cases/errors/resource-not-found-error'
import { makeAcceptAdoptionRequestUseCase } from 'src/use-cases/factories/make-accept-adoption-request-use-case'
import { z } from 'zod'

export async function acceptAdoptionRequests(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchAdoptionRequestParamsSchema = z.object({
    adopt_request_id: z.string(),
  })

  const { adopt_request_id } = fetchAdoptionRequestParamsSchema.parse(
    request.params,
  )

  const fetchAdoptionRequestsUseCase = makeAcceptAdoptionRequestUseCase()

  try {
    const { acceptedAdoptionRequest } =
      await fetchAdoptionRequestsUseCase.execute({
        adopt_request_id,
        user_id: request.user.sub,
      })
    return reply.status(200).send(acceptedAdoptionRequest)
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
