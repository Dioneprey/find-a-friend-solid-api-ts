import { AdoptionRequest } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface FetchAdoptionRequestsPetUseCaseRequest {
  org_id: string
  user_id: string
}

interface FetchAdoptionRequestsPetUseCaseResponse {
  adoptionRequests: AdoptionRequest[]
}

export class FetchAdoptionRequestsPetUseCase {
  constructor(
    private adoptionRequestsRepository: AdoptionRequestsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    org_id,
    user_id,
  }: FetchAdoptionRequestsPetUseCaseRequest): Promise<FetchAdoptionRequestsPetUseCaseResponse> {
    const isOrgExist = await this.orgsRepository.findById(org_id)

    if (!isOrgExist) {
      throw new ResourceNotFoundError()
    }

    const isOrgBelongToUser = isOrgExist.user_id === user_id

    if (!isOrgBelongToUser) {
      throw new InvalidCredentialsError()
    }
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
