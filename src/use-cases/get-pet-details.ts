import { Pet } from '@prisma/client'
import { PetsRepository } from 'src/repositories/pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetPetDetailsUseCaseRequest {
  id: string
}

interface GetPetDetailsUseCaseResponse {
  petDetails: Pet
}

export class GetPetDetailsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    id,
  }: GetPetDetailsUseCaseRequest): Promise<GetPetDetailsUseCaseResponse> {
    const petDetails = await this.petsRepository.findById(id)

    if (!petDetails) {
      throw new ResourceNotFoundError()
    }

    return {
      petDetails,
    }
  }
}
