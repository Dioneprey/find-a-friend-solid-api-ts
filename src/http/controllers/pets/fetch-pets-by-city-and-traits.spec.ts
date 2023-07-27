import request from 'supertest'
import { app } from 'src/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { CreateAndAuthenticateUser } from 'src/utils/test/create-and-authenticate-user'
import { prisma } from 'src/lib/prisma'

describe('Fetch Pets by city and traits (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
    const { token } = await CreateAndAuthenticateUser(app, true)

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

    await prisma.pet.create({
      data: {
        id: 'pet_2',
        name: 'Zed',
        age: 1,
        animal: 'Dog',
        breed: 'Akita',
        color: 'Brown',
        size: 'LARGE',
        org_id: response.body.org,
      },
    })

    await prisma.pet.create({
      data: {
        id: 'pet_3',
        name: 'Kayn',
        age: 1,
        animal: 'Dog',
        breed: 'Corgi',
        color: 'Brown',
        size: 'LARGE',
        org_id: response.body.org,
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch pets by city', async () => {
    const { token } = await CreateAndAuthenticateUser(app, false)

    const response = await request(app.server)
      .post(`/pets`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        city: 'São Paulo',
      })
    expect(response.body.pets).toHaveLength(3)
  })
  it('should be able to fetch pets by city and traits', async () => {
    const { token } = await CreateAndAuthenticateUser(app, false)

    const response = await request(app.server)
      .post(`/pets`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        city: 'São Paulo',
        traits: {
          animal: 'Dog',
        },
      })
    expect(response.body.pets).toHaveLength(2)
  })
})
