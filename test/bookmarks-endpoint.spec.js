const {
    expect
} = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Bookmarks Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    app.set('db', db)

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('bookmarks').truncate())

    context('Given there are bookmarks in the database', () => {
        const testBookmarks = [{
                "id": 1,
                "title": "AAAAAAA",
                "url": "https://www.thinkful.com",
                "rating": "5",
                "description": "Think outside the classroom"
            },
            {
                "id": 2,
                "title": "BBBBBB",
                "url": "https://www.google.com",
                "rating": "4",
                "description": "Where we find everything else"
            },
            {
                "id": 3,
                "title": "CCCCCC",
                "url": "https://developer.mozilla.org",
                "rating": "5",
                "description": "The only place to find web documentation"
            }
        ]

        beforeEach('insert bookmarks', () => {
            return db
                .into('bookmarks')
                .insert(testBookmarks)
        })
        it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
            return supertest(app)
                .get('/bookmarks', )
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`,            console.log(`got into GET test`)
                )
                .expect(200, testBookmarks)
        })
    })
})