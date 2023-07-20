import { expect, describe, it, beforeEach } from 'vitest'

import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'
import { InMemoryAdoptionRequestsRepository } from 'src/repositories/in-memory/in-memory-adoption-requests-repository'
import { AcceptAdoptPetRequestUseCase } from './accept-adoption-request'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let adoptionRequestsRepository: AdoptionRequestsRepository
let sut: AcceptAdoptPetRequestUseCase

describe('Accept Adoption Pet Request Use Case', () => {
  beforeEach(() => {
    adoptionRequestsRepository = new InMemoryAdoptionRequestsRepository()
    sut = new AcceptAdoptPetRequestUseCase(adoptionRequestsRepository)
  })

  it('should be able to accept adoption pet request', async () => {
    const adoptionRequest = await adoptionRequestsRepository.create({
      pet_id: 'pet.id',
      user_id: 'user_id',
      org_id: 'org_id',
    })

    const { acceptedAdoptionRequest } = await sut.execute({
      adopt_request_id: adoptionRequest.id,
    })

    expect(acceptedAdoptionRequest.adopted_at).toEqual(expect.any(Date))
  })

  it('should not be able to accept adoption pet request already accepted', async () => {
    const adoptionRequest = await adoptionRequestsRepository.create({
      pet_id: 'pet.id',
      user_id: 'user_id',
      org_id: 'org_id',
      adopted_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        adopt_request_id: adoptionRequest.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to accept an adoption request for a pet that does not exist', async () => {
    await expect(() =>
      sut.execute({
        adopt_request_id: 'adoptionRequest_not_exists_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
