import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterOrgUseCase } from './register-org'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to create a org', async () => {
    const { org } = await sut.execute({
      name: 'Happy Pet',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
    })

    expect(org.id).toEqual(expect.any(String))
  })
})
