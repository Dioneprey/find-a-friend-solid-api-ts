import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { RegisterPetUseCase } from './register-pet'
import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let orgsRepository: InMemoryOrgsRepository
let sut: RegisterPetUseCase

describe('Register Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterPetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to register a pet', async () => {
    const org = await orgsRepository.create({
      name: 'Happy Pet',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
      user_id: '123',
    })

    const { pet } = await sut.execute({
      name: 'Akali',
      age: 0.7,
      animal: 'Cat',
      breed: 'Siamese',
      color: 'Grey',
      size: 'MID',
      org_id: org.id,
      user_id: '123',
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be able to register a pet without a valid org id', async () => {
    await expect(() =>
      sut.execute({
        name: 'Akali',
        age: 0.7,
        animal: 'Cat',
        breed: 'Siamese',
        color: 'Grey',
        size: 'MID',
        org_id: 'abc',
        user_id: '123',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
