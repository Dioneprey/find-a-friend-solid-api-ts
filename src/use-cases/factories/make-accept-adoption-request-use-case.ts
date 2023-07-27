import { PrismaOrgsRepository } from 'src/repositories/prisma/prisma-orgs-repository'
import { AcceptAdoptPetRequestUseCase } from '../accept-adoption-request'
import { PrismaAdoptionRequestsRepository } from 'src/repositories/prisma/prisma-adoption-request-repository'

export function makeAcceptAdoptionRequestUseCase() {
  const adoptionRequestRepository = new PrismaAdoptionRequestsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const acceptAdoptPetRequestUseCase = new AcceptAdoptPetRequestUseCase(
    adoptionRequestRepository,
    orgsRepository,
  )

  return acceptAdoptPetRequestUseCase
}
