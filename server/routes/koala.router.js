const express = require('express');
const koalaRouter = express.Router();

// DB CONNECTION
const pool = require('../modules/pool');

// *** GET
koalaRouter.get('/', (req, res) => {
  // do a DB query
  pool
    .query(
      `SELECT * FROM "koalas"
            ORDER BY "id" ASC`
    )
    .then(function (dbRes) {
      // console.log(dbRes.rows);
      // send all koalas to client
      res.send(dbRes.rows);
    })
    // or handle DB errors
    .catch(function (err) {
      console.log(err);
      res.sendStatus(500);
    });
});

// *** POST
koalaRouter.post('/', (req, res) => {
  /*
  Query should look like this:

  INSERT INTO "koalas"
    ("name", "gender", "age", "transfer", "notes")
  VALUES
    ('some artist', 'tracky', '1-1-1970', 7);

  */

  console.log('req.body', req.body);

  // do a DB query
  pool
    .query(
      `
    INSERT INTO "koalas"
    ("name", "gender", "age", "ready_to_transfer", "notes")
    VALUES
    ('${req.body.name}', '${req.body.gender}', '${req.body.age}', '${req.body.ready_to_transfer}', '${req.body.notes}');
    `
    )
    // could be .then(dbRes => {.... })
    .then(function (dbRes) {
      // console.log(dbRes.rows);
      res.sendStatus(201);
    })
    // or handle DB errors
    .catch(function (err) {
      console.log(err);
      // don't ghost your client!
      // send a status
      res.sendStatus(500);
    });
});

// PUT
// need to update the ready to transfer
koalaRouter.put('/:id', (req, res) => {
  console.log('req.params', req.params);
  let koalaID = req.params.id;

  let sqlText = `UPDATE "koalas" SET "ready_to_transfer" = TRUE WHERE id=$1`;

  pool
    .query(sqlText, [koalaID])
    .then((dbRes) => {
      console.log(dbRes);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log('error', err);
      res.sendStatus(500);
    });
});

// DELETE

module.exports = koalaRouter;
