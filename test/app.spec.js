const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200', () => {
    return supertest(app)
      .get('/')
      .expect(200)
  })
  it('GET /bookmark responds with 200', () => {
    return supertest(app)
      .get('/bookmark')
      .expect(200)
  })
  it('GET /bookmark:id responds with 200', () => {
    return supertest(app)
      .get('/bookmark/1')
      .expect(200)
  })
  it('POST /bookmark responds with 400, bad request', () => {
    return supertest(app)
      .post('/bookmark')
      .expect(400)
  })
  it('DELETE /bookmark responds with 204', () => {
    return supertest(app)
      .delete('/bookmark/1')
      .expect(204)
  })
  it('should run authentication', () => {
    return supertest(app)
      .get('/bookmark')
      .expect(401)
  })
})