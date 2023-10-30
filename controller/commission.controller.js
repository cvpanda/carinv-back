const carmodel = require("../models/carmodel");
const commissions = require("../models/commission");

exports.commission = async (req, res) => {
  try {
    const commissionData = await commissions.find({});
    const uniqueCommission = {};
    commissionData.forEach((item) => {
      const type = item.type;
      const company = item.company;

      if (!uniqueCommission[type]) {
        uniqueCommission[type] = company;
      } else {
        uniqueCommission[type] += `, ${company}`;
      }
    });
    const result = Object.keys(uniqueCommission).map((type) => ({
      type: type,
      company: uniqueCommission[type],
    }));
    res.send({
      statusCode: 200,
      massage: "commission data fetch successfully",
      data: result,
    });
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "commission data fetch fail",
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
