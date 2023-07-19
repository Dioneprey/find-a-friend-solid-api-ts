import { Pet, Prisma } from '@prisma/client'
import { PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findByCharacteristics(params: string) {
    return this.items.filter(
      (item) =>
        item.age === parseFloat(params) ||
        item.animal === params ||
        item.breed === params ||
        item.color === params,
    )
  }

  async findManyByOrg(org_id: string) {
    return this.items.filter((item) => item.org_id === org_id)
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: data.id ?? randomUUID(),
      name: data.name,
      age: data.age,
      animal: data.animal,
      breed: data.breed,
      color: data.color,
      size: data.size,
      org_id: data.org_id,
    }

    this.items.push(pet)

    return pet
  }

  async save(pet: Pet) {
    const petIndex = this.items.findIndex((item) => item.id === pet.id)

    if (petIndex >= 0) {
      this.items[petIndex] = pet
    }

    return pet
  }
}
