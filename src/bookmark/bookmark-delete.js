const express = require('express')
const bookmarkDELETE = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store
const logger = require('../logger')

bookmarkDELETE.delete('/bookmark/:id', (req, res) => {
    const {
      id
    } = req.params;
    const bookmarkIndex = BOOKMARK.findIndex(c =>  c.id.toString() === id);
  
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

module.exports = bookmarkDELETE