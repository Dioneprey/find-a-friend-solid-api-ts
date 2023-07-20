import { AdoptionRequest } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'

interface AcceptAdoptPetRequestUseCaseRequest {
  adopt_request_id: string
}

interface AcceptAdoptPetRequestUseCaseResponse {
  acceptedAdoptionRequest: AdoptionRequest
}

export class AcceptAdoptPetRequestUseCase {
  constructor(private adoptionRequestsRepository: AdoptionRequestsRepository) {}

  async execute({
    adopt_request_id,
  }: AcceptAdoptPetRequestUseCaseRequest): Promise<AcceptAdoptPetRequestUseCaseResponse> {
    const adoptedPetRequest = await this.adoptionRequestsRepository.findById(
      adopt_request_id,
    )

    if (!adoptedPetRequest) {
      throw new ResourceNotFoundError()
    }

    const acceptedAdoptionRequest = await this.adoptionRequestsRepository.save({
      ...adoptedPetRequest,
      adopted_at: new Date(),
    })

    return {
      acceptedAdoptionRequest,
    }
  }
}
