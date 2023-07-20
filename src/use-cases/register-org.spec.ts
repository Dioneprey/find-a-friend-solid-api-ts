import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from 'src/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryUsersRepository } from 'src/repositories/in-memory/in-memory-users-repository'
import { RegisterOrgUseCase } from './register-org'
import { hash } from 'bcryptjs'
import { OrgAccountRequired } from './errors/org-account-required-error'

let orgsRepository: InMemoryOrgsRepository
let usersRepository: InMemoryUsersRepository
let sut: RegisterOrgUseCase

describe('Register Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterOrgUseCase(orgsRepository, usersRepository)
  })

  it('should be able to create a org if is a org account', async () => {
    const user = await usersRepository.create({
      name: 'Happy Pet Account',
      email: 'happypet@gmail.com',
      password_hash: await hash('123', 6),
      role: 'ORG',
    })

    const { org } = await sut.execute({
      name: 'Happy Pet',
      description: 'Happy Pet managed to rescue abandoned dogs and cats...',
      phone: '33999999999',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      uf: 'SP',
      user_id: user.id,
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to create a org without a org account', async () => {
    const user = await usersRepository.create({
      name: 'User Account',
      email: 'user@gmail.com',
      password_hash: await hash('123', 6),
      role: 'USER',
    })

    await expect(() =>
      sut.execute({
        name: 'Happy Pet',
        description: 'Happy Pet managed to rescue abandoned dogs and cats...',
        phone: '33999999999',
        address: 'Rua Principal, 123',
        city: 'São Paulo',
        uf: 'SP',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(OrgAccountRequired)
  })
})
