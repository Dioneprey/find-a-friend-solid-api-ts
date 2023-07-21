import { Pet, Prisma, Size } from '@prisma/client'

export interface TraitsPetParams {
  age?: number
  animal?: string
  breed?: string
  color?: string
  size?: Size
}
export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  findManyByOrgAndTraits(
    org_id: string,
    trait: TraitsPetParams | undefined,
  ): Promise<Pet[]>
  create(data: Prisma.PetCreateInput): Promise<Pet>
  save(pet: Pet): Promise<Pet>
}
