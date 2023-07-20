import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs.repository'
import { randomUUID } from 'crypto'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }

  async findManyByCity(city: string) {
    const orgs: Org[] = []
    this.items.forEach((item) => {
      if (item.city === city) {
        orgs.push(item)
      }
    })

    if (orgs?.length < 1) {
      return null
    }

    return orgs
  }

  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone,
      address: data.address,
      city: data.city,
      uf: data.uf,
      user_id: data.user_id,
    }

    this.items.push(org)

    return org
  }
}
