import { Org } from '@prisma/client'
import { OrgsRepository } from 'src/repositories/orgs.repository'
import { UsersRepository } from 'src/repositories/users-repository'
import { OrgAccountRequired } from './errors/org-account-required-error'

interface RegisterOrgUseCaseRequest {
  name: string
  description: string | null
  phone: string
  address: string
  city: string
  uf: string
  user_id: string
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(
    private orgsRepository: OrgsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    name,
    description,
    phone,
    address,
    city,
    uf,
    user_id,
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const user = await this.usersRepository.findById(user_id)
    const isUserAOrgAccount = user?.role === 'ORG'

    if (!isUserAOrgAccount) {
      throw new OrgAccountRequired()
    }

    const org = await this.orgsRepository.create({
      name,
      description,
      phone,
      address,
      city,
      uf,
      user_id,
    })

    return {
      org,
    }
  }
}
