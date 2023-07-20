export class OrgAccountRequired extends Error {
  constructor() {
    super('A organization account is required.')
  }
}
