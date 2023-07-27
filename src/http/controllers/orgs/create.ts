import { FastifyRequest, FastifyReply } from 'fastify'
import { OrgAccountRequired } from 'src/use-cases/errors/org-account-required-error'
import { makeRegisterOrgUseCase } from 'src/use-cases/factories/make-register-org-use-case'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrgBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().refine((value) => value.length >= 11, {
      message: 'Phone must be at least 11 characters',
    }),
    address: z.string(),
    city: z.string(),
    uf: z.string().refine((value) => value.length === 2, {
      message: 'UF must be 2 characters',
    }),
  })

  const { name, description, phone, address, city, uf } =
    createOrgBodySchema.parse(request.body)

  const registerOrgUseCase = makeRegisterOrgUseCase()

  try {
    const { org } = await registerOrgUseCase.execute({
      name,
      description,
      phone,
      address,
      city,
      uf,
      user_id: request.user.sub,
    })
    return reply.status(201).send({ org: org.id })
  } catch (error) {
    if (error instanceof OrgAccountRequired) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
