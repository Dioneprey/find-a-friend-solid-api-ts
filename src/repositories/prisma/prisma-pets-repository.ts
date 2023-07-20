import { prisma } from 'src/lib/prisma'
import { PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async findManyByOrgAndTraits(org_id: string, trait: string) {
    // const pets = await prisma.pet.findMany({
    //   where: {
    //     org_id,
    //     AND: {
    //       animal: trait,
    //       age: trait,
    //       breed: trait,
    //     }
    //   },
    // })
  }
}
