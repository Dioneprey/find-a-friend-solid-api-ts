import { PrismaPetsRepository } from 'src/repositories/prisma/prisma-pets-repository'
import { GetPetDetailsUseCase } from '../get-pet-details'

export function makePetDetailsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const getPetDetailsUseCase = new GetPetDetailsUseCase(petsRepository)

  return getPetDetailsUseCase
}
