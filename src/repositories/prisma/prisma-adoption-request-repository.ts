import { AdoptionRequest, Prisma } from '@prisma/client'
import { prisma } from 'src/lib/prisma'
import { AdoptionRequestsRepository } from '../adoption-requests-repository'

export class PrismaAdoptionRequestsRepository
  implements AdoptionRequestsRepository
{
  async findById(id: string) {
    const adoptionRequest = await prisma.adoptionRequest.findUnique({
      where: {
        id,
        adopted_at: null,
      },
    })

    return adoptionRequest
  }

  async findMany(org_id: string) {
    const adoptionRequests = await prisma.adoptionRequest.findMany({
      where: {
        org_id,
        adopted_at: null,
      },
    })

    return adoptionRequests
  }

  async create(data: Prisma.AdoptionRequestCreateInput) {
    const adoptionRequest = await prisma.adoptionRequest.create({
      data,
    })

    return adoptionRequest
  }

  async save(data: AdoptionRequest) {
    const adoptionRequest = await prisma.adoptionRequest.update({
      where: {
        id: data.id,
      },
      data,
    })

    return adoptionRequest
  }
}
