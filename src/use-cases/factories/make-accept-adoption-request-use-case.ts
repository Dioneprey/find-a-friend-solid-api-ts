import { AcceptAdoptPetRequestUseCase } from '../accept-adoption-request'
import { PrismaAdoptionRequestsRepository } from 'src/repositories/prisma/prisma-adoption-request-repository'

export function makeAcceptAdoptionRequestUseCase() {
  const adoptionRequestRepository = new PrismaAdoptionRequestsRepository()
  const acceptAdoptPetRequestUseCase = new AcceptAdoptPetRequestUseCase(
    adoptionRequestRepository,
  )

  return acceptAdoptPetRequestUseCase
}
