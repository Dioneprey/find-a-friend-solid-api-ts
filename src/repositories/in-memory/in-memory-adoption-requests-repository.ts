import { AdoptionRequest, Prisma } from '@prisma/client'
import { AdoptionRequestsRepository } from '../adoption-requests-repository'
import { randomUUID } from 'crypto'

export class InMemoryAdoptionRequestsRepository
  implements AdoptionRequestsRepository
{
  public items: AdoptionRequest[] = []
  async findById(id: string) {
    const adoptionRequest = this.items.find(
      (item) => item.id === id && item.adopted_at === null,
    )

    if (!adoptionRequest) {
      return null
    }

    return adoptionRequest
  }

  async findMany(org_id: string) {
    return this.items.filter(
      (item) => item.org_id === org_id && item.adopted_at === null,
    )
  }

  async create(
    data: Prisma.AdoptionRequestCreateInput & { adopted_at?: Date },
  ) {
    const adoptionRequest = {
      id: data.id ?? randomUUID(),
      org_id: data.org_id,
      user_id: data.user_id,
      pet_id: data.pet_id,
      adopted_at: data.adopted_at ?? null,
      created_at: new Date(),
    }

    this.items.push(adoptionRequest)

    return adoptionRequest
  }

  async save(AdoptionRequest: AdoptionRequest) {
    const AdoptionRequestIndex = this.items.findIndex(
      (item) => item.id === AdoptionRequest.id,
    )

    if (AdoptionRequestIndex >= 0) {
      this.items[AdoptionRequestIndex] = AdoptionRequest
    }

    return AdoptionRequest
  }
}
