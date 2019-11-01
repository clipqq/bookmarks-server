const {
    expect
} = require('chai')
const knex = require('knex')
const app = require('../src/app')

const testBookmarks = [{
        id: 1,
        title: 'Thinkful',
        url: 'https://www.thinkful.com',
        description: 'Think outside the classroom',
        rating: '5',
    },
    {
        id: 2,
        title: 'Google',
        url: 'https://www.google.com',
        description: 'Where we find everything else',
        rating: '4',
    },
    {
        id: 3,
        title: 'MDN',
        url: 'https://developer.mozilla.org',
        description: 'The only place to find web documentation',
        rating: '5',
    },
]

const maliciousBookmark = [{
    id: -666,
    title: 'Evil content',
    url: 'https://www.hellspawn.com',
    description: 'redrumredrum',
    rating: '0000',
}]


describe('Bookmarks Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => db('bookmarks').truncate())

    afterEach('cleanup', () => db('bookmarks').truncate())

    describe('GET /bookmarks', () => {
        context(`Given no bookmarks`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })

        context('Given there are bookmarks in the database', () => {
            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks')
                    .insert(testBookmarks)
            })

            it('gets the bookmarks from the store', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testBookmarks)
            })
            it('responds with 200 and the specified bookmark', () => {
                const bookmarkId = '2'
                const expectedBookmark = testBookmarks[bookmarkId - 1]
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, expectedBookmark, testBookmarks)
            })
            it(`responds 404 when bookmark doesn't exist`, () => {
                return supertest(app)
                    .get(`/bookmarks/999999`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {
                        error: {
                            message: `Bookmark Not Found`
                        }
                    })
            })

        })

        // context(`Given an XSS attack bookmark`, () => {
        //     const {
        //         maliciousBookmark,
        //         expectedBookmark
        //     } = fixtures.makeMaliciousBookmark()

        //     beforeEach('insert malicious bookmark', () => {
        //         return db
        //             .into('bookmarks')
        //             .insert([maliciousBookmark])
        //     })

        //     it('removes XSS attack content', () => {
        //         return supertest(app)
        //             .get(`/bookmarks`)
        //             .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
        //             .expect(200)
        //             .expect(res => {
        //                 expect(res.body[0].title).to.eql(maliciousBookmark.title)
        //                 expect(res.body[0].description).to.eql(maliciousBookmark.description)
        //             })
        //     })
        // })

    })

    describe(`POST /bookmarks`, () => {
        it('adds a new bookmark to the store', () => {
            const newBookmark = {
                title: 'test-title',
                url: 'https://www.test.com',
                description: 'test description',
                rating: '5',
            }
            console.log(newBookmark, `new bookmark`)
            return supertest(app)
                .post(`/bookmarks`)
                .send(newBookmark)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newBookmark.title)
                    expect(res.body.url).to.eql(newBookmark.url)
                    expect(res.body.description).to.eql(newBookmark.description)
                    expect(res.body.rating).to.eql(newBookmark.rating)
                    expect(res.body).to.have.property('id')
                })
                .then(res =>
                    supertest(app)
                    .get(`/bookmarks/${res.body.id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(res.body)
                )
        })

    })

    describe('DELETE /bookmarks/:id', () => {
        context(`Given no bookmarks`, () => {
            it(`responds 404 whe bookmark doesn't exist`, () => {
                return supertest(app)
                    .delete(`/bookmarks/123`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {
                        error: {
                            message: `Bookmark Not Found`
                        }
                    })
            })
        })

        context('Given there are bookmarks in the database', () => {
            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks')
                    .insert(testBookmarks)
            })

            it('removes the bookmark by ID from the store', () => {
                const idToRemove = 2
                const expectedBookmarks = testBookmarks.filter(bm => bm.id !== idToRemove)
                return supertest(app)
                    .delete(`/bookmarks/${idToRemove}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(() =>
                        supertest(app)
                        .get(`/bookmarks`)
                        .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedBookmarks)
                    )
            })
        })

    })
})