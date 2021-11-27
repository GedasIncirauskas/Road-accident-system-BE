const express = require('express');
const cors = require('cors');
const { port } = require('./config.js');
const fileupload = require('express-fileupload');
const logger = require('../logger.js');

const auth = require('./routes/v1/auth.js');
const accident = require('./routes/v1/accident.js');
const statistic = require('./routes/v1/statistic.js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use('/static', express.static('files'));

app.use('/', auth);
app.use('/v1/', accident);
app.use('/v1/', statistic);

app.all('*', (req, res) => {
  return res.status(404).send({ msg: 'Page not found' });
});

app.listen(port, () => logger.info(`Working on ${port}`));
