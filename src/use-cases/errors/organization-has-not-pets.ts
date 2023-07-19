export class OrganizationHasNotPets extends Error {
  constructor() {
    super('Organization has not pets registered.')
  }
}
