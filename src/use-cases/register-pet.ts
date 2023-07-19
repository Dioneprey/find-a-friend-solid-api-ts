import { Pet } from '@prisma/client'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import { PetsRepository } from 'src/repositories/pets-repository'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'

interface RegisterPetUseCaseRequest {
  name: string
  age: number
  animal: string
  breed: string
  color: string
  size: 'SMALL' | 'MID' | 'LARGE'
  org_id: string
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
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const isOrgExist = await this.orgsRepository.findById(org_id)

    if (!isOrgExist) {
      throw new OrganizationNotFoundError()
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
