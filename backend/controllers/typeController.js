const {
  getAllTypes,
  updateType,
  getTypeById,
  deleteType,
  addType,
} = require("../models/typeModel");

const getTypes = (req, res) => {
  getAllTypes((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку типів.");
    }

    return res.send(data);
  });
};

const getType = (req, res) => {
  const typeId = req.params.type_id;

  getTypeById(typeId, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.send(data);
  });
};

const putType = (req, res) => {
  const typeId = req.params.type_id;
  const newType = req.body;

  updateType(typeId, newType, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).send(data);
  });
};

const deleteTypeRecord = (req, res) => {
  const typeId = req.params.type_id;

  deleteType(typeId, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.send(data);
  });
};

const postType = (req, res) => {
  const typeName = req.body.type_name;

  addType(typeName, (err, data) => {
    if (err) return res.status(500).send(err);

    console.log(data);

    return res
      .status(201)
      .send({ type_id: data.insertId, type_name: typeName });
  });
};

module.exports = {
  getTypes,
  getType,
  putType,
  deleteTypeRecord,
  postType,
};
