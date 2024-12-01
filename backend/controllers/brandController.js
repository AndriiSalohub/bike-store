const {
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  addBrand,
} = require("../models/brandModel");

const getBrands = (req, res) => {
  getAllBrands((err, data) => {
    if (err) {
      return res.status(500).send("Помилка при отриманні списку брендів.");
    }

    return res.send(data);
  });
};

const getBrand = (req, res) => {
  const brandId = req.params.brand_id;

  getBrandById(brandId, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.send(data);
  });
};

const putBrand = (req, res) => {
  const brandId = req.params.brand_id;
  const newBrand = req.body;

  updateBrand(brandId, newBrand, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).send(data);
  });
};

const deleteBrandRecord = (req, res) => {
  const brandId = req.params.brand_id;

  deleteBrand(brandId, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).send(data);
  });
};

const postBrand = (req, res) => {
  const brandName = req.body.brand_name;

  addBrand(brandName, (err, data) => {
    if (err) return res.status(500).send(err);

    console.log(data);

    return res
      .status(201)
      .send({ brand_id: data.insertId, brand_name: brandName });
  });
};

module.exports = {
  getBrands,
  getBrand,
  putBrand,
  deleteBrandRecord,
  postBrand,
};
