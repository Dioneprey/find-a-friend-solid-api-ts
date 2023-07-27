import { Pet } from '@prisma/client'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import { PetsRepository } from 'src/repositories/pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface RegisterPetUseCaseRequest {
  name: string
  age: number
  animal: string
  breed: string
  color: string
  size: 'SMALL' | 'MID' | 'LARGE'
  org_id: string
  user_id: string
}

interface RegisterPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    name,
    age,
    animal,
    breed,
    color,
    size,
    org_id,
    user_id,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const isOrgExist = await this.orgsRepository.findById(org_id)

    if (!isOrgExist) {
      throw new ResourceNotFoundError()
    }

    const isUserOwnerOrg = isOrgExist.user_id === user_id

    if (!isUserOwnerOrg) {
      throw new InvalidCredentialsError()
    }

    const pet = await this.petsRepository.create({
      name,
      age,
      animal,
      breed,
      color,
      size,
      org_id,
    })

    return {
      pet,
    }
  }
}
