import { CreateAdoptionPetRequestUseCase } from '../create-adoption-pet-request'
import { PrismaPetsRepository } from 'src/repositories/prisma/prisma-pets-repository'
import { PrismaAdoptionRequestsRepository } from 'src/repositories/prisma/prisma-adoption-request-repository'

export function makeCreateAdoptionPetRequestUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const adoptionRequestRepository = new PrismaAdoptionRequestsRepository()
  const adoptionPetRequestUseCase = new CreateAdoptionPetRequestUseCase(
    petsRepository,
    adoptionRequestRepository,
  )

  return adoptionPetRequestUseCase
}
