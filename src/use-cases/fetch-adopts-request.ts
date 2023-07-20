import { AdoptionRequest } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'

interface FetchAdoptionRequestsPetUseCaseRequest {
  org_id: string
}

interface FetchAdoptionRequestsPetUseCaseResponse {
  adoptionRequests: AdoptionRequest[]
}

export class FetchAdoptionRequestsPetUseCase {
  constructor(private adoptionRequestsRepository: AdoptionRequestsRepository) {}

  async execute({
    org_id,
  }: FetchAdoptionRequestsPetUseCaseRequest): Promise<FetchAdoptionRequestsPetUseCaseResponse> {
    const adoptionRequests = await this.adoptionRequestsRepository.findMany(
      org_id,
    )

    if (adoptionRequests?.length < 1) {
      throw new ResourceNotFoundError()
    }

    return {
      adoptionRequests,
    }
  }
}
