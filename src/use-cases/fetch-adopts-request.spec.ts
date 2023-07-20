import { expect, describe, it, beforeEach } from 'vitest'

import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'
import { InMemoryAdoptionRequestsRepository } from 'src/repositories/in-memory/in-memory-adoption-requests-repository'
import { FetchAdoptionRequestsPetUseCase } from './fetch-adopts-request'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let adoptionRequestsRepository: AdoptionRequestsRepository
let sut: FetchAdoptionRequestsPetUseCase

describe('Fetch Adopts Requests Use Case', () => {
  beforeEach(async () => {
    adoptionRequestsRepository = new InMemoryAdoptionRequestsRepository()
    sut = new FetchAdoptionRequestsPetUseCase(adoptionRequestsRepository)

    await adoptionRequestsRepository.create({
      pet_id: 'pet_id_1',
      user_id: '123',
      org_id: 'org_id_1',
    })

    await adoptionRequestsRepository.create({
      pet_id: 'pet_id_2',
      user_id: '123',
      org_id: 'org_id_1',
    })
  })

  it('should be able to fetch adopt pet requests by org id', async () => {
    const { adoptionRequests } = await sut.execute({
      org_id: 'org_id_1',
    })

    expect(adoptionRequests).toHaveLength(2)
  })

  it('should not be able to fetch adopt pet requests with invalid org id', async () => {
    await expect(() =>
      sut.execute({
        org_id: 'invalid_org_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
