import { Org } from '@prisma/client'
import { OrgsRepository } from 'src/repositories/orgs.repository'

interface RegisterOrgUseCaseRequest {
  name: string
  description: string | null
  phone: string
  address: string
  city: string
  uf: string
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    description,
    phone,
    address,
    city,
    uf,
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const org = await this.orgsRepository.create({
      name,
      description,
      phone,
      address,
      city,
      uf,
    })

    return {
      org,
    }
  }
}
