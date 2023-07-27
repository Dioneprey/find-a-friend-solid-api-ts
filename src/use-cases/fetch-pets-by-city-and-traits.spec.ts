import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { FetchPetsByCityAndTraitsUseCase } from './fetch-pets-by-city-and-traits'
import { OrganizationHasNotPets } from './errors/organization-has-not-pets'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: FetchPetsByCityAndTraitsUseCase

describe('Fetch Pets By City and Traits Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchPetsByCityAndTraitsUseCase(petsRepository, orgsRepository)

    await orgsRepository.create({
      id: 'org_1',
      name: 'Happy Pet',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
      user_id: '1',
    })
    await orgsRepository.create({
      id: 'org_2',
      name: 'Happy Pet 2',
      description: 'Happy Pet 2 managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 1235',
      city: 'São Paulo',
      uf: 'SP',
      user_id: '2',
    })
    await petsRepository.create({
      name: 'Akali',
      age: 0.7,
      animal: 'Cat',
      breed: 'Siamese',
      color: 'Grey',
      size: 'MID',
      org_id: 'org_1',
    })
    await petsRepository.create({
      name: 'Zed',
      age: 1,
      animal: 'Dog',
      breed: 'Akita',
      color: 'Brown',
      size: 'LARGE',
      org_id: 'org_2',
    })
  })

  it('should be able to fetch pets by city', async () => {
    const { pets } = await sut.execute({
      city: 'São Paulo',
    })

    expect(pets).toHaveLength(2)
  })

  it('should be able to fetch pets by city and traits', async () => {
    const { pets } = await sut.execute({
      city: 'São Paulo',
      traits: {
        color: 'Brown',
      }, // expect one pet that have brown color
    })

    expect(pets).toHaveLength(1)
  })

  it('should not find pets in city without any pet registered', async () => {
    await orgsRepository.create({
      name: 'Happy Pet RJ',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'Rio de Janeiro',
      uf: 'RJ',
      user_id: '3',
    })

    await expect(() =>
      sut.execute({
        city: 'Rio de Janeiro',
      }),
    ).rejects.toBeInstanceOf(OrganizationHasNotPets)
  })
})
