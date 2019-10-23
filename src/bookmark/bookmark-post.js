const express = require('express')
const bookmarkPOST = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store
const logger = require('../logger')
const uuidv4 = require('uuid/v4')

bookmarkPOST.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      logger.error(`Unauthorized request to path: ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })

bookmarkPOST.route('/bookmark')
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

module.exports = bookmarkPOST