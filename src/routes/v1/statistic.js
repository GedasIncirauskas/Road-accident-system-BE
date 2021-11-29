const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../../config.js');
const { loggedIn } = require('../../middleware.js');

//Get all statistic at real time
router.get('/statistic', loggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const query = `
      SELECT id_accident, user, description, time, status
      FROM accident
      ORDER BY time DESC
    `;
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
});

module.exports = router;
