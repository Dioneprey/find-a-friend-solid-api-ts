import { expect, describe, it, beforeEach } from 'vitest'

import { CreateAdoptionPetRequestUseCase } from './create-adoption-pet-request'
import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { AdoptionRequestsRepository } from 'src/repositories/adoption-requests-repository'
import { InMemoryAdoptionRequestsRepository } from 'src/repositories/in-memory/in-memory-adoption-requests-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let adoptionRequestsRepository: AdoptionRequestsRepository
let sut: CreateAdoptionPetRequestUseCase

describe('Create Adopt Pet Request Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    adoptionRequestsRepository = new InMemoryAdoptionRequestsRepository()
    sut = new CreateAdoptionPetRequestUseCase(
      petsRepository,
      adoptionRequestsRepository,
    )
  })

  it('should be able to create adopt pet request', async () => {
    const pet = await petsRepository.create({
      name: 'Akali',
      age: 0.7,
      animal: 'Cat',
      breed: 'Siamese',
      color: 'Grey',
      size: 'MID',
      org_id: 'org_id',
    })

    const { adoptedPetRequest } = await sut.execute({
      pet_id: pet.id,
      user_id: '123',
    })

    expect(adoptedPetRequest.id).toEqual(expect.any(String))
  })

  it('should not be able to create adopt pet request with invalid pet id', async () => {
    await expect(() =>
      sut.execute({
        pet_id: 'invalid_pet_id',
        user_id: '123',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
