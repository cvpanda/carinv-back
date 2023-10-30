const carmodel = require("../models/carmodel");
const cityState = require("../models/cityState");

exports.cityState = async (req, res) => {
  try {
    const cityStateData = await cityState.find({});

    const uniqueCities = {};
    cityStateData.forEach((item) => {
      const region = item.region;
      const city = item.city;

      if (!uniqueCities[region]) {
        uniqueCities[region] = city;
      } else {
        uniqueCities[region] += `, ${city}`;
      }
    });
    const result = Object.keys(uniqueCities).map((region) => ({
      region: region,
      city: uniqueCities[region],
    }));

    res.send({
      statusCode: 200,
      massage: "city_state data fetch successfully",
      data: result,
    });
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "city_state data fetch fail",
      error: err,
    });
  }
};

exports.carModel = async (req, res) => {
  try {
    const carmodeldata = await carmodel.find({ is_deleted: false }).lean();

    const result = carmodeldata.reduce((acc, obj) => {
      const { brand, model, version } = obj;
      if (!acc[brand]) {
        acc[brand] = { brand, models: {} };
      }
      if (!acc[brand].models[model]) {
        acc[brand].models[model] = [];
      }
      acc[brand].models[model].push(version);
      return acc;
    }, {});

    const groupedData = Object.values(result);
    res.send({
      statusCode: 200,
      massage: "Car Model data fetch successfully",
      data: groupedData,
    });
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "Car Model  data fetch fail",
      error: err,
    });
  }
};
