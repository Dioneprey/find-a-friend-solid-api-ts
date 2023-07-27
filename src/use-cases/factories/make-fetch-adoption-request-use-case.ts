import { PrismaAdoptionRequestsRepository } from 'src/repositories/prisma/prisma-adoption-request-repository'
import { FetchAdoptionRequestsPetUseCase } from '../fetch-adoption-requests'
import { PrismaOrgsRepository } from 'src/repositories/prisma/prisma-orgs-repository'

export function makeFetchAdoptionRequestsUseCase() {
  const adoptionRequestRepository = new PrismaAdoptionRequestsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const fetchAdoptionRequestsUseCase = new FetchAdoptionRequestsPetUseCase(
    adoptionRequestRepository,
    orgsRepository,
  )

  return fetchAdoptionRequestsUseCase
}
