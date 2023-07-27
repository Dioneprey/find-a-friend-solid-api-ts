import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { register } from './register'
import { verifyJWT } from 'src/http/middlewares/verify-jwt'
import { profile } from './profile'
import { refresh } from './refresh'
import { createAdoptionRequest } from './create-adoption-requests'
import { verifyUserRole } from 'src/http/middlewares/verify-user-role'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)
  /** Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.post(
    '/adoption-requests',
    { onRequest: [verifyUserRole('USER')] },
    createAdoptionRequest,
  )
}
