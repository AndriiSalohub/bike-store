const {
  getAllTypes,
  updateType,
  getTypeById,
  deleteType,
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

module.exports = {
  getTypes,
  getType,
  putType,
  deleteTypeRecord,
};
