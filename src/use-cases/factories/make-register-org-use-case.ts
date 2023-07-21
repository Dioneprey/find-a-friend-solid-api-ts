import { PrismaUsersRepository } from 'src/repositories/prisma/prisma-users-repository'
import { RegisterOrgUseCase } from '../register-org'
import { PrismaOrgsRepository } from 'src/repositories/prisma/prisma-orgs-repository'

export function makeRegisterOrgUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const orgsRepository = new PrismaOrgsRepository()
  const registerOrgUseCase = new RegisterOrgUseCase(
    orgsRepository,
    usersRepository,
  )

  return registerOrgUseCase
}
