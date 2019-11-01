const express = require('express')
const bookmarkRouters = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store
const logger = require('../logger')
const uuidv4 = require('uuid/v4')
const BookmarksService = require('./bookmark-service')
const { isWebUri } = require('valid-url')
const xss = require('xss')

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: bookmark.url,
    description: xss(bookmark.description),
    rating: bookmark.rating,
  })
  

bookmarkRouters.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(401).json({
            error: 'Unauthorized request'
        })
    }
    // move to the next middleware
    next()
})

// homepage
bookmarkRouters.get('/', (req, res) => {
    res
        .send('Homepage works!');
});

bookmarkRouters
    .route('/bookmarks')
    .get((req, res, next) => {
        BookmarksService.getAllBookmarks(req.app.get('db'))
            .then(bookmarks => {
                res.json(bookmarks.map(serializeBookmark))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        for (const field of ['title', 'url', 'rating']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send(`'${field}' is required`)
            }
        }

        const {
            title,
            url,
            description,
            rating
        } = req.body

        if (!Number.isInteger(parseInt(rating)) || parseInt(rating) < 0 || parseInt(rating) > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send(`'rating' must be a number between 0 and 5`)
        }

        if (!isWebUri(url)) {
            logger.error(`Invalid url '${url}' supplied`)
            return res.status(400).send(`'url' must be a valid URL`)
        }

        const newBookmark = {
            title,
            url,
            description,
            rating
        }

        BookmarksService.insertBookmark(
                req.app.get('db'),
                newBookmark,
                console.log(`doing insertion`)
            )
            .then(bookmark => {
                logger.info(`Card with id ${bookmark.id} created.`)
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(serializeBookmark(bookmark))
            })
            .catch(next)
    })

bookmarkRouters
    .route('/bookmarks/:bookmark_id')
    .all((req, res, next) => {
        const {
            bookmark_id
        } = req.params
        BookmarksService.getById(req.app.get('db'), bookmark_id)
            .then(bookmark => {
                if (!bookmark) {
                    logger.error(`Bookmark with id ${bookmark_id} not found.`)
                    return res.status(404).json({
                        error: {
                            message: `Bookmark Not Found`
                        }
                    })
                }
                res.bookmark = bookmark
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(res.bookmark)
    })
    .delete((req, res, next) => {
        // TODO: update to use db
        const {
            bookmark_id
        } = req.params
        BookmarksService.deleteBookmark(
                req.app.get('db'),
                bookmark_id
            )
            .then(numRowsAffected => {
                logger.info(`Card with id ${bookmark_id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
    })


module.exports = bookmarkRouters