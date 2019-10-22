const express = require('express')
const bookmarkGETid = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store
const logger = require('../logger')

bookmarkGETid.get('/bookmark/:id', (req, res) => {
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

  module.exports = bookmarkGETid