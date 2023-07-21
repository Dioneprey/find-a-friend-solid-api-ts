import { PrismaOrgsRepository } from 'src/repositories/prisma/prisma-orgs-repository'
import { RegisterPetUseCase } from '../register-pet'
import { PrismaPetsRepository } from 'src/repositories/prisma/prisma-pets-repository'

export function makeRegisterPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()

  const registerPetUseCase = new RegisterPetUseCase(
    petsRepository,
    orgsRepository,
  )

  return registerPetUseCase
}
