import { AdoptionRequest } from '@prisma/client'
import { PetsRepository } from 'src/repositories/pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'

interface CreateAdoptionPetRequestUseCaseRequest {
  pet_id: string
  user_id: string
}

interface CreateAdoptionPetRequestUseCaseResponse {
  adoptedPetRequest: AdoptionRequest
}

export class CreateAdoptionPetRequestUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private adoptionRequestsRepository: AdoptionRequestsRepository,
  ) {}

  async execute({
    pet_id,
    user_id,
  }: CreateAdoptionPetRequestUseCaseRequest): Promise<CreateAdoptionPetRequestUseCaseResponse> {
    const pet = await this.petsRepository.findById(pet_id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const adoptedPetRequest = await this.adoptionRequestsRepository.create({
      pet_id,
      user_id,
      org_id: pet.org_id,
    })

    return {
      adoptedPetRequest,
    }
  }
}
