const db = require("../models");
const Themes = db.themes;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  // let limit = size ? +size : 5;
  let limit = size;
  if(!limit){
   limit = 5
 }
  if(limit > 15){
     limit = 15;
  }
   const offset = page ? page * limit : 0;
 
   return { limit, offset };
 };

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: themes } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, themes, totalPages, currentPage };
};

// Create and Save a new Themes
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const theme = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  };

  // Save Tutorial in the database
  Themes.create(theme)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(400).send({
        message:
          err.message || "Some error occurred while creating the Theme."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const { page, pageSize, title } = req.query;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  const { limit, offset } = getPagination(page, pageSize);

  Themes.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Themes.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Themes.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(204).send();
      } else {
        res.status(403).send({
          message: `user without permission`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};