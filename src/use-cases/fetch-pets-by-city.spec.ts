import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { OrganizationNotFoundError } from './errors/organization-not-found-error'
import { FetchPetsByCityUseCase } from './fetch-pets-by-city'
import { OrganizationHasNotPets } from './errors/organization-has-not-pets'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: FetchPetsByCityUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new FetchPetsByCityUseCase(petsRepository, orgsRepository)
  })

  it('should be able to fetch pets by city', async () => {
    const orgOne = await orgsRepository.create({
      name: 'Happy Pet 2',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
    })
    const orgTwo = await orgsRepository.create({
      name: 'Happy Pet',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
    })

    await petsRepository.create({
      name: 'Akali',
      age: 0.7,
      animal: 'Cat',
      breed: 'Siamese',
      color: 'Grey',
      size: 'MID',
      org_id: orgOne.id,
    })

    await petsRepository.create({
      name: 'Zed',
      age: 1,
      animal: 'Dog',
      breed: 'Akita',
      color: 'Brown',
      size: 'LARGE',
      org_id: orgTwo.id,
    })

    const { pets } = await sut.execute({
      city: 'São Paulo',
    })

    expect(pets).toHaveLength(2)
  })

  it.only('should not find pets in city without any pet registered', async () => {
    await orgsRepository.create({
      name: 'Happy Pet',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
    })

    await expect(() =>
      sut.execute({
        city: 'São Paulo',
      }),
    ).rejects.toBeInstanceOf(OrganizationHasNotPets)
  })
})
