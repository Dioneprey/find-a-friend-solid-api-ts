import request from 'supertest'
import { app } from 'src/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { CreateAndAuthenticateUser } from 'src/utils/test/create-and-authenticate-user'
import { prisma } from 'src/lib/prisma'

describe('Accept Adoption Request (e2e)', () => {
  let tokenJwt: string
  beforeAll(async () => {
    await app.ready()
    const { token } = await CreateAndAuthenticateUser(app, true)
    tokenJwt = token
    const response = await request(app.server)
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

    await prisma.pet.create({
      data: {
        id: 'pet_1',
        name: 'Akali',
        age: 0.7,
        animal: 'Cat',
        breed: 'Siamese',
        color: 'Grey',
        size: 'MID',
        org_id: response.body.org,
      },
    })

    await prisma.adoptionRequest.create({
      data: {
        id: 'request_1',
        pet_id: 'pet_1',
        org_id: response.body.org,
        user_id: 'user_1',
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to accept adoption request', async () => {
    const response = await request(app.server)
      .patch('/adoption-requests/request_1')
      .set('Authorization', `Bearer ${tokenJwt}`)
      .send()
    expect(response.body.adopted_at).toEqual(expect.any(String))
  })
})
