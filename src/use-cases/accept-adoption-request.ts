import { AdoptionRequest } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AcceptAdoptPetRequestUseCaseRequest {
  adopt_request_id: string
  user_id: string
}

interface AcceptAdoptPetRequestUseCaseResponse {
  acceptedAdoptionRequest: AdoptionRequest
}

export class AcceptAdoptPetRequestUseCase {
  constructor(
    private adoptionRequestsRepository: AdoptionRequestsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    adopt_request_id,
    user_id,
  }: AcceptAdoptPetRequestUseCaseRequest): Promise<AcceptAdoptPetRequestUseCaseResponse> {
    const adoptedPetRequest = await this.adoptionRequestsRepository.findById(
      adopt_request_id,
    )

    if (!adoptedPetRequest) {
      throw new ResourceNotFoundError()
    }

    const petOrg = await this.orgsRepository.findById(adoptedPetRequest.org_id)

    const isOrgBelongToUser = petOrg?.user_id === user_id

    if (!isOrgBelongToUser) {
      throw new InvalidCredentialsError()
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
