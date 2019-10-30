const app = require('../src/app')

describe('App', () => {
  // it('GET / responds with 200', () => {
  //   return supertest(app)
  //     .get('/')
  //     .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //     .expect(200)
  // })
  // it('GET /bookmarks responds with 200', () => {
  //   return supertest(app)
  //     .get('/bookmarks')
  //     .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
  //     .expect(200)
  // })
  it('GET /bookmark:id responds with 200', () => {
    return supertest(app)
      .get('/bookmark/1')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200)
  })
  it('POST /bookmark responds with 400, bad request', () => {
    return supertest(app)
      .post('/bookmark')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(400)
  })
  it('DELETE /bookmark responds with 204', () => {
    return supertest(app)
      .delete('/bookmark/1')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)

      .expect(204)
  })
  it('should fail with no authentication', () => {
    return supertest(app)
      .get('/bookmark')
      .expect(401)
  })
})