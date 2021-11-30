const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();
const { dbConfig } = require('../../config.js');
const { loggedIn } = require('../../middleware.js');

//Post accident
router.post('/accident', async (req, res) => {
  const { user, description, lat, lng } = req.body;
  if (!user || !description || !lat || !lng) {
    res.status(400).send({ err: 'Incorrect data passed' });
    return;
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const query = `
      INSERT INTO accident (user, description, lat, lng)
      VALUES (${mysql.escape(user)}, ${mysql.escape(description)}, ${mysql.escape(lat)}, ${mysql.escape(lng)})`;
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Please try again' });
  }
});

//Upload photo
// router.post('/upload', (req, res) => {
//   const newpath = __dirname + '/../../../files/';
//   const file = req.files.file;
//   const filename = file.name + 1;

//   file.mv(`${newpath}${filename}`, (err) => {
//     if (err) {
//       res.status(500).send({ message: 'File upload failed' });
//       return;
//     }
//     res.status(200).send({ message: 'File Uploaded', code: 200, path: `/static/${filename}` });
//   });
// });

//Get all accident
router.get('/accident', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const query = `
      SELECT *
      FROM accident
      WHERE status = 0
    `;
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
});

//Delete accident
router.delete('/accident/:id', loggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(`UPDATE accident SET status = 1 WHERE id_accident = ${mysql.escape(req.params.id)}`);
    await con.end();
    return res.send(data);
  } catch (err) {
    return res.status(500).send({ err: 'Internal Server Error' });
  }
});

module.exports = router;
