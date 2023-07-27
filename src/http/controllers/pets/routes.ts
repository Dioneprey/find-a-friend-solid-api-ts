import { FastifyInstance } from 'fastify'
import { verifyJWT } from 'src/http/middlewares/verify-jwt'
import { getPetDetails } from './get-pet-details'
import { fetchPetsByCityAndTraits } from './fetch-pets-by-city-and-traits'

export async function petsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  /** Authenticated */
  app.post('/pets', fetchPetsByCityAndTraits)
  app.get('/pet-details/:id', getPetDetails)
}
