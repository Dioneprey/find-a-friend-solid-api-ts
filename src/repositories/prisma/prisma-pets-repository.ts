import { prisma } from 'src/lib/prisma'
import { PetsRepository, TraitsPetParams } from '../pets-repository'
import { Pet, Prisma } from '@prisma/client'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findManyByOrgAndTraits(org_id: string, trait: TraitsPetParams) {
    const pets = await prisma.pet.findMany({
      where: {
        org_id,
        AND: {
          animal: trait.animal,
          age: trait.age,
          breed: trait.breed,
          color: trait.color,
          size: trait.size,
        },
      },
    })

    return pets
  }

  async create(data: Prisma.PetCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async save(data: Pet) {
    const pet = await prisma.pet.update({
      where: {
        id: data.id,
      },
      data,
    })

    return pet
  }
}
