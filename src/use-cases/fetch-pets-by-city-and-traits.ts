import { Pet } from '@prisma/client'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import {
  PetsRepository,
  TraitsPetParams,
} from 'src/repositories/pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { OrganizationHasNotPets } from './errors/organization-has-not-pets'

interface FetchPetsByCityAndTraitsUseCaseRequest {
  city: string
  trait?: TraitsPetParams
}

interface FetchPetsByCityAndTraitsUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByCityAndTraitsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    city,
    trait,
  }: FetchPetsByCityAndTraitsUseCaseRequest): Promise<FetchPetsByCityAndTraitsUseCaseResponse> {
    const allOrgsByCity = await this.orgsRepository.findManyByCity(city)

    if (!allOrgsByCity) {
      throw new ResourceNotFoundError()
    }

    const pets: Pet[] = []

    for (const item of allOrgsByCity) {
      const pet = await this.petsRepository.findManyByOrgAndTraits(
        item.id,
        trait || undefined,
      )
      pet.forEach((item) => {
        if (!item.adopted_at) {
          pets.push(item)
        }
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
