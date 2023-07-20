import { AdoptionRequest, Prisma } from '@prisma/client'

export interface AdoptionRequestsRepository {
  findById(id: string): Promise<AdoptionRequest | null>
  findMany(org_id: string): Promise<AdoptionRequest[]>
  create(data: Prisma.AdoptionRequestCreateInput): Promise<AdoptionRequest>
  save(AdoptionRequest: AdoptionRequest): Promise<AdoptionRequest>
}
