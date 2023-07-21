import { PrismaPetsRepository } from 'src/repositories/prisma/prisma-pets-repository'
import { FetchPetsByCityAndTraitsUseCase } from '../fetch-pets-by-city-and-traits'
import { PrismaOrgsRepository } from 'src/repositories/prisma/prisma-orgs-repository'

export function makeFetchPetsByCityAndTraitsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const fetchPetsByCityAndTraitsUseCase = new FetchPetsByCityAndTraitsUseCase(
    petsRepository,
    orgsRepository,
  )

  return fetchPetsByCityAndTraitsUseCase
}
