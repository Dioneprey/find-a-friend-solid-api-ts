import { FastifyInstance } from 'fastify'
import { verifyJWT } from 'src/http/middlewares/verify-jwt'
import { create } from './create'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { registerPet } from './register-pet'
import { getPetDetails } from './get-pet-details'
import { fetchAdoptionRequests } from './fetch-adoption-requests'

export async function orgsRoutes(app: FastifyInstance) {
  /** Authenticated */
  app.post('/orgs', { onRequest: [verifyJWT] }, create)
  app.get('/pet-details/:id', { onRequest: [verifyJWT] }, getPetDetails)
  app.post('/pets', { onRequest: [verifyUserRole('ORG')] }, registerPet)
  app.get(
    '/adoption-requests/:org_id',
    { onRequest: [verifyUserRole('ORG')] },
    fetchAdoptionRequests,
  )
}
