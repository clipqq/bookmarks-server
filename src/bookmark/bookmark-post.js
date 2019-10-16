const express = require('express')
const bookmarkPOST = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store

bookmarkPOST.route('/bookmark')
    .post(bodyParser, (req, res) => {
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
        const uuid = BOOKMARK.length + 1;
        console.log(`passed uuid`)

        const bookmark = {
            uuid,
            title,
            content
        };

        BOOKMARK.push(bookmark);

        logger.info(`Bookmark with id ${uuid} created`);

        res
            .status(201)
            .location(`http://localhost:8000/bookmark/${uuid}`)
            .json({
                uuid
            });
    })

module.exports = bookmarkPOST