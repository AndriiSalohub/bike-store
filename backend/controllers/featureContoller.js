const {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
  getFeaturesByBikeId,
} = require("../models/featureModel");

const getFeatures = (req, res) => {
  getAllFeatures((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні списку характеристик.");
    }
    return res.send(data);
  });
};

const getFeature = (req, res) => {
  const featureId = req.params.feature_id;
  getFeatureById(featureId, (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length === 0)
      return res.status(404).send("Характеристику не знайдено");
    return res.send(data[0]);
  });
};

const postFeature = (req, res) => {
  const featureData = req.body;
  createFeature(featureData, (err, result) => {
    if (err) {
      return res.status(500).send("Помилка при створенні характеристики.");
    }
    return res.status(201).send({
      message: "Характеристику успішно додано",
      featureId: result.insertId,
    });
  });
};

const putFeature = (req, res) => {
  const featureId = req.params.feature_id;
  const featureData = req.body;

  updateFeature(featureId, featureData, (err) => {
    if (err) {
      return res.status(500).send("Помилка при оновленні характеристики.");
    }
    return res.send({ message: "Характеристику успішно оновлено" });
  });
};

const deleteFeaturesHandler = (req, res) => {
  const featureId = req.params.feature_id;

  deleteFeature(featureId, (err) => {
    if (err) {
      return res.status(500).send("Помилка при видаленні характеристики.");
    }
    return res.send({ message: "Характеристику успішно видалено" });
  });
};

const getBikeFeatures = (req, res) => {
  const bikeId = req.params.bike_id;
  console.log(bikeId);

  getFeaturesByBikeId(bikeId, (err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні характеристик велосипеда.");
    }
    return res.send(data);
  });
};

module.exports = {
  getFeatures,
  getFeature,
  postFeature,
  putFeature,
  deleteFeaturesHandler,
  getBikeFeatures,
};
