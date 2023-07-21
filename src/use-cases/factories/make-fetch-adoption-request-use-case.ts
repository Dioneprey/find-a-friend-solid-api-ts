import { PrismaAdoptionRequestsRepository } from 'src/repositories/prisma/prisma-adoption-request-repository'
import { FetchAdoptionRequestsPetUseCase } from '../fetch-adoption-requests'

export function makeFetchAdoptionRequestsUseCase() {
  const adoptionRequestRepository = new PrismaAdoptionRequestsRepository()
  const fetchAdoptionRequestsUseCase = new FetchAdoptionRequestsPetUseCase(
    adoptionRequestRepository,
  )

  return fetchAdoptionRequestsUseCase
}
