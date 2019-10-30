const express = require('express')
const bookmarkRouters = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store
const logger = require('../logger')
const uuidv4 = require('uuid/v4')
const BookmarksService = require('./bookmark-service')


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
                        res.json(bookmarks) // serialize was here
                })
        .catch(next)
    })

// get all bookmarks
// bookmarkRouters.route('/bookmark').get((req, res) => {
//     res
//         .json(BOOKMARK);
// })

// get by id
bookmarkRouters.get('/bookmark/:id', (req, res) => {
    const {
        id
    } = req.params;
    const bookmark = BOOKMARK.find(c => c.id == id);

    // make sure we found a bookmark
    if (!bookmark) {
        logger.error(`Bookmark with id ${id} not found.`);
        return res
            .status(404)
            .send('Bookmark Not Found');
    }

    res.json(bookmark);
});

// post new bookmark
bookmarkRouters.route('/bookmark')
    .post((req, res) => {
        console.log(`req.body`, req.body)

        const {
            title,
            content
        } = req.body;
        if (!title) {
            logger.error(`Title is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!content) {
            logger.error(`Content is required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        console.log(`before uuid`)
        const id = uuidv4();
        console.log(`passed uuid`)

        const bookmark = {
            id,
            title,
            content
        };
        BOOKMARK.push(bookmark);

        logger.info(`Bookmark with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/bookmark/${id}`)
            .json({
                id
            });
    })

// delete bookmark by id
bookmarkRouters.delete('/bookmark/:id', (req, res) => {
    const {
        id
    } = req.params;
    const bookmarkIndex = BOOKMARK.findIndex(c => c.id.toString() === id);

    if (bookmarkIndex === -1) {
        logger.error(`bookmark with id ${id} not found.`);
        return res
            .status(404)
            .send('Not found');
    }

    BOOKMARK.splice(bookmarkIndex, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res
        .status(204)
        .end();
});


module.exports = bookmarkRouters