import { expect, describe, it, beforeEach } from 'vitest'

import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'
import { InMemoryAdoptionRequestsRepository } from 'src/repositories/in-memory/in-memory-adoption-requests-repository'
import { FetchAdoptionRequestsPetUseCase } from './fetch-adoption-requests'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'

let adoptionRequestsRepository: AdoptionRequestsRepository
let orgsRepository: OrgsRepository
let sut: FetchAdoptionRequestsPetUseCase

describe('Fetch Adopts Requests Use Case', () => {
  beforeEach(async () => {
    adoptionRequestsRepository = new InMemoryAdoptionRequestsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchAdoptionRequestsPetUseCase(
      adoptionRequestsRepository,
      orgsRepository,
    )

    await orgsRepository.create({
      id: 'org_id_1',
      name: 'Happy Pet',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
      user_id: '123',
    })

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
      user_id: '123',
    })

    expect(adoptionRequests).toHaveLength(2)
  })

  it('should not be able to fetch adopt pet requests with invalid org id', async () => {
    await expect(() =>
      sut.execute({
        org_id: 'invalid_org_id',
        user_id: 'invalid_user_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
