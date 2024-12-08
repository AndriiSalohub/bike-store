const {
  getAllBrands,
  getBrandById,
  updateBrand,
  softDeleteBrand,
  addBrand,
  getDeletedBrands,
  restoreBrand,
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

const softDeleteBrandRecord = (req, res) => {
  const brandId = req.params.brand_id;

  softDeleteBrand(brandId, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.send(data);
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

const getDeletedBrandsRecord = (req, res) => {
  getDeletedBrands((err, data) => {
    if (err) {
      return res
        .status(500)
        .send("Помилка при отриманні списку видалених брендів.");
    }

    return res.send(data);
  });
};

const restoreBrandRecord = (req, res) => {
  const brandId = req.params.brand_id;

  restoreBrand(brandId, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).send({ message: "Бренд успішно відновлено" });
  });
};

module.exports = {
  getBrands,
  getBrand,
  putBrand,
  softDeleteBrandRecord,
  postBrand,
  getDeletedBrandsRecord,
  restoreBrandRecord,
};
