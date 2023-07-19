import { Org, Pet } from '@prisma/client'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import { PetsRepository } from 'src/repositories/pets-repository'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { OrganizationHasNotPets } from './errors/organization-has-not-pets'

interface FetchPetsByCityUseCaseRequest {
  city: string
}

interface FetchPetsByCityUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByCityUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    city,
  }: FetchPetsByCityUseCaseRequest): Promise<FetchPetsByCityUseCaseResponse> {
    const allOrgsByCity = await this.orgsRepository.findManyByCity(city)

    if (!allOrgsByCity) {
      throw new OrganizationNotFoundError()
    }

    const pets: Pet[] = []

    for (const item of allOrgsByCity) {
      const pet = await this.petsRepository.findManyByOrg(item.id)
      pet.forEach((item) => {
        pets.push(item)
      })
    }

    if (pets.length === 0) {
      throw new OrganizationHasNotPets()
    }
    return {
      pets,
    }
  }
}
