import { FastifyInstance } from 'fastify'
import { verifyJWT } from 'src/http/middlewares/verify-jwt'
import { create } from './create'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'
import { registerPet } from './register-pet'
import { fetchAdoptionRequests } from './fetch-adoption-requests'
import { acceptAdoptionRequests } from './accept-adoption-requests'

export async function orgsRoutes(app: FastifyInstance) {
  /** Authenticated */
  app.post('/orgs', { onRequest: [verifyJWT] }, create)
  app.post(
    '/register/pets',
    { onRequest: [verifyUserRole('ORG')] },
    registerPet,
  )
  app.get(
    '/adoption-requests/:org_id',
    { onRequest: [verifyUserRole('ORG')] },
    fetchAdoptionRequests,
  )
  app.patch(
    '/adoption-requests/:adopt_request_id',
    { onRequest: [verifyUserRole('ORG')] },
    acceptAdoptionRequests,
  )
}
