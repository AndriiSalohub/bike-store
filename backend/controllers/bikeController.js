const {
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
  getTopBikes,
} = require("../models/bikeModel");

const getBikes = (req, res) => {
  getAllBikes((err, data) => {
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
  const newBike = req.body;

  updateBike(bikeId, newBike, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(data);
  });
};

const deleteBikeRecord = (req, res) => {
  const bikeId = req.params.bike_id;

  deleteBike(bikeId, (err, data) => {
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

module.exports = {
  getBikes,
  getBike,
  putBike,
  deleteBikeRecord,
  getBikesWithHighestRating,
};
