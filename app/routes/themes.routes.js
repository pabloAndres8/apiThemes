module.exports = app => {
  const themes = require("../controllers/themes.controller.js");
  const bodyParser = require('body-parser');
  const router = require("express").Router();

  // Create a new Tutorial
  router.post('/', themes.create);

  // Retrieve all Tutorials
  router.get('/', themes.findAll);

  // Retrieve a single Tutorial with id
  router.get('/:id', themes.findOne);

  // Update a Tutorial with id
  router.patch('/:id', themes.update);

  app.use(bodyParser.json());
  app.use('/api/themes', router);
};
