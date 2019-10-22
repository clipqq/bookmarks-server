const express = require('express')
const bookmarkGET = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store
const logger = require('../logger')

bookmarkGET.route('/bookmark').get((req, res) => {
    res
        .json(BOOKMARK);
})

module.exports = bookmarkGET