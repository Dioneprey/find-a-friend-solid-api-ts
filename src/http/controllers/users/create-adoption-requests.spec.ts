import request from 'supertest'
import { app } from 'src/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { CreateAndAuthenticateUser } from 'src/utils/test/create-and-authenticate-user'

describe('Create Adoption Request (e2e)', () => {
  let petResponse: any
  beforeAll(async () => {
    await app.ready()
    const { token } = await CreateAndAuthenticateUser(app, true)

    const orgResponse = await request(app.server)
      .post('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Happy Pet',
        description: 'Happy Pet managed to rescue abandoned dogs and cats...',
        phone: '33999999999',
        address: 'Rua Principal, 123',
        city: 'São Paulo',
        uf: 'SP',
      })

    petResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Akali',
        age: 0.7,
        animal: 'Cat',
        breed: 'Siamese',
        color: 'Grey',
        size: 'MID',
        org_id: orgResponse.body.org,
      })
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create adoption request', async () => {
    const { token } = await CreateAndAuthenticateUser(app, false)

    const response = await request(app.server)
      .post('/adoption-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        pet_id: petResponse.body.pet,
      })

    expect(response.statusCode).toEqual(201)
  })
})
