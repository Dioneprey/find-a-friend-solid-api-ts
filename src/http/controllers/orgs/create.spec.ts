import request from 'supertest'
import { app } from 'src/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { CreateAndAuthenticateUser } from 'src/utils/test/create-and-authenticate-user'

describe('Create Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a org with a org account', async () => {
    const { token } = await CreateAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Org Yes',
        description: 'Description Yes',
        phone: '33999999990',
        address: 'Avenue Yes',
        city: 'City Yes',
        uf: 'MG',
      })

    expect(response.statusCode).toEqual(201)
  })

  it('should not be able to create a org without a org account', async () => {
    const { token } = await CreateAndAuthenticateUser(app, false)

    const response = await request(app.server)
      .post('/orgs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Org Yes',
        description: 'Description Yes',
        phone: '33999999990',
        address: 'Avenue Yes',
        city: 'City Yes',
        uf: 'MG',
      })

    expect(response.statusCode).toEqual(409)
  })
})
