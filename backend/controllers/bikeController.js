const {
  getAllBikes,
  getBikeById,
  updateBike,
  softDeleteBike,
  getTopBikes,
  addBike,
  getDeletedBikes,
  restoreBike,
} = require("../models/bikeModel");

const getBikes = (req, res) => {
  const filters = req.query.filters ? JSON.parse(req.query.filters) : null;
  const sorting = req.query.sorting;

  getAllBikes(filters, sorting, (err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку велосипедів.");
    }

    return res.send(data);
  });
};

const getBike = (req, res) => {
  const bikeId = req.params.bike_id;

  getBikeById(bikeId, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data);
  });
};

const putBike = (req, res) => {
  const bikeId = req.params.bike_id;
  let newBike = req.body;

  newBike = Object.fromEntries(
    Object.entries(req.body).filter(
      ([key, value]) =>
        value !== null &&
        key !== "promotion_name" &&
        key !== "promotion_start_date" &&
        key !== "promotion_end_date" &&
        key !== "discount_percentage",
    ),
  );

  updateBike(bikeId, newBike, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).send(data);
  });
};

const softDeleteBikeRecord = (req, res) => {
  const bikeId = req.params.bike_id;

  softDeleteBike(bikeId, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data);
  });
};

const getBikesWithHighestRating = (req, res) => {
  getTopBikes((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні списку велосипедів з найвищім рейтингом.");
    }

    return res.send(data);
  });
};

const postBike = (req, res) => {
  const newBike = req.body;

  addBike(newBike, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(201).send({ ...newBike });
  });
};

const getDeletedBikesRecord = (req, res) => {
  getDeletedBikes((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні списку видалених велосипедів.");
    }

    return res.send(data);
  });
};

const restoreBikeRecord = (req, res) => {
  const bikeId = req.params.bike_id;

  restoreBike(bikeId, (err, data) => {
    if (err) return res.status(500).send(err);
    return res
      .status(200)
      .send({ message: "Велосипеди відновлені успішно", bikeId });
  });
};

module.exports = {
  getBikes,
  getBike,
  putBike,
  softDeleteBikeRecord,
  getBikesWithHighestRating,
  postBike,
  getDeletedBikesRecord,
  restoreBikeRecord,
};
