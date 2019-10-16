const express = require('express')
const bookmarkDELETE = express.Router()
const bodyParser = express.json()
const BOOKMARK = require('./bookmark') // new data store

bookmarkDELETE.delete('/bookmark/:id', (req, res) => {
    console.log(`got in delete`)
    const {
      id
    } = req.params;
  
    const bookmarkIndex = BOOKMARK.findIndex(c => c.id === id);
  
    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }
  
    //remove bookmark from lists
    //assume bookmarkIds are not duplicated in the bookmarkIds array
    // BOOKMARK.forEach(i => {
    //   const bookmarkIds = i.bookmarkIds.filter(cid => cid !== id);
    //   i.bookmarkIds = bookmarkIds;
    // });

    // let pos = 0

    // for(let i=0;BOOKMARK.length;i++) {
    //     if(BOOKMARK[i].id===id) {
    //         pos = i
    //     }
    // }

    BOOKMARK.splice(bookmarkIndex, 1);
    // BOOKMARK.splice(pos, 1);

  
    logger.info(`bookmark with id ${id} deleted.`);
  
    res
      .status(204)
      .end();
  });

module.exports = bookmarkDELETE