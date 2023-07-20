import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryPetsRepository } from 'src/repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetPetDetailsUseCase } from './get-pet-details'

let petsRepository: InMemoryPetsRepository
let sut: GetPetDetailsUseCase

describe('Get Pet Details Use Case', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetDetailsUseCase(petsRepository)
  })

  it('should be able to get a pet details', async () => {
    const pet = await petsRepository.create({
      name: 'Akali',
      age: 0.7,
      animal: 'Cat',
      breed: 'Siamese',
      color: 'Grey',
      size: 'MID',
      org_id: 'org_id',
    })

    const { petDetails } = await sut.execute({
      id: pet.id,
    })

    expect(petDetails).toEqual(expect.objectContaining({ id: petDetails.id }))
  })

  it('should not be able to get a pet details with invalid id', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalid_pet_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to get a pet details of a adopted pet', async () => {
    const pet = await petsRepository.create({
      name: 'Akali',
      age: 0.7,
      animal: 'Cat',
      breed: 'Siamese',
      color: 'Grey',
      size: 'MID',
      org_id: 'org_id',
    })

    const adoptedPet = {
      ...pet,
      adopted_at: new Date(),
    }

    await petsRepository.save(adoptedPet)

    await expect(() =>
      sut.execute({
        id: pet.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
