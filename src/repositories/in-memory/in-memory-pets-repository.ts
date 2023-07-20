import { Pet, Prisma } from '@prisma/client'
import { PetsRepository, TraitsPetParams } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet || pet.adopted_at) {
      return null
    }

    return pet
  }

  async findManyByOrgAndTraits(org_id: string, trait: TraitsPetParams) {
    const allPetsByCity = this.items.filter((item) => item.org_id === org_id)

    if (trait) {
      const petsByCityAndTraits = allPetsByCity.filter(
        (item) =>
          item.age === trait.age &&
          item.animal === trait.animal &&
          item.breed === trait.breed &&
          item.color === trait.color &&
          item.size === trait.size,
      )
      return petsByCityAndTraits
    }

    return allPetsByCity
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
      adopted_at: null,
      created_at: new Date(),
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
