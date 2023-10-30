// const logger = require("../middlewere/logger");

const { log } = require("winston");
const car = require("../models/car");
const task = require("../models/task");

exports.readcarByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const usercarData = await car.find({ user: userid, is_deleted: false });

    res.send({
      statusCode: 200,
      massage: "user fetch successfully",
      data: usercarData,
    });
  } catch (err) {
    res.send({ statusCode: 500, massage: "car fetch fail", error: err });
  }
};
exports.readcarById = async (req, res) => {
  try {
    const { carid } = req.params;
    const onecarData = await car.findOne({ _id: carid, is_deleted: false });

    const tasks = await task.find({ car_id: carid });

    res.send({
      statusCode: 200,
      massage: "Single Car fetch successfully",
      data: { ...onecarData._doc, tasks: tasks },
    });
  } catch (err) {
    //console.log(err.message);

    res.send({ statusCode: 500, massage: "Single fetch fail", error: err });
  }
};
exports.allcar = async (req, res) => {
  try {
    const allcar = await car.find({ is_deleted: false }).sort({
      createdAt: -1,
    });

    res.send({
      statusCode: 200,
      massage: "car fetch successfully",
      data: allcar,
    });
  } catch (err) {
    //console.log(err.message);

    res.send({ statusCode: 500, massage: "car fetch fail", error: err });
  }
};

exports.addnewcar = async (req, res) => {
  try {
    const totalcost =
      req.body.charges_items &&
      req.body.charges_items.flatMap((item) => item.price);
    const charges_amount = totalcost.reduce((a, b) => a + b, 0);
    const newCardata = await car.create({
      ...req.body,
      charges_amount,
      status: "New Car",
    });

    if (newCardata) {
      await newCardata.save();

      res.send({
        statusCode: 200,
        massage: "New Car Added Successfully",
        data: newCardata,
      });
    }
  } catch (err) {
    //console.log(err.message);
    res.send({
      statusCode: 500,
      massage: err.message,
      error: err,
    });
  }
};

exports.publishcar = async (req, res) => {
  try {
    const { id } = req.params;
    const { publish_date, published_price, inventory } = req.body;
    const publishdata = await car.findByIdAndUpdate(id, {
      publish_date: new Date(publish_date),
      inventory: inventory,
      inspection_date: new Date(),
      published_price: published_price,
      status: "Publish",
    });
    if (publishdata) {
      await publishdata.save();

      res.send({
        statusCode: 200,
        massage: "Publish Car data Updated Successfully",
        data: publishdata,
      });
    }
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "Opps Something Want Wrong, Contact Administrator",
      error: err,
    });
  }
};

exports.updateInspectionDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { inspection_date } = req.body;
    const publishdata = await car.findByIdAndUpdate(id, {
      inspection_date: new Date(inspection_date),
    });
    if (publishdata) {
      await publishdata.save();
      res.send({
        statusCode: 200,
        massage: "Inspection Date Updated Successfully",
        data: publishdata,
      });
    }
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "Opps Something Want Wrong, Contact Administrator",
      error: err,
    });
  }
};

exports.addcharge = async (req, res) => {
  try {
    const { id } = req.params;
    const { charges_items } = req.body;

    const totalcost =
      req.body.charges_items &&
      req.body.charges_items.flatMap((item) => item.price);

    const charges_amount = totalcost.reduce((a, b) => a + b, 0);

    const cardata = await car.findById(id);
    const charges_newtotal_amount = charges_amount + cardata.charges_amount;

    const newchargesitems = await car.findByIdAndUpdate(id, {
      $push: { charges_items: { $each: charges_items } },
      charges_amount: charges_newtotal_amount,
      margin:
        cardata.selling_price -
        (cardata.purchase_price + charges_newtotal_amount),
    });
    if (newchargesitems) {
      await newchargesitems.save();

      res.send({
        statusCode: 200,
        massage: "new charge data Updated Successfully",
        data: newchargesitems,
      });
    }
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "Opps Something Went Wrong, Contact Administrator",
      error: err.message,
    });
  }
};

exports.addcommission = async (req, res) => {
  try {
    const { id } = req.params;
    const { commission_items } = req.body;

    const newcommissionitems = await car.findByIdAndUpdate(id, {
      $push: { commission_items: { $each: commission_items } },
      margin: 0,
    });
    if (newcommissionitems) {
      await newcommissionitems.save();
      res.send({
        statusCode: 200,
        massage: "new commission data Updated Successfully",
        data: newcommissionitems,
      });
    } else {
      res.send({
        statusCode: 404,
        massage: "No se pudo actualizar la data",
        data: newcommissionitems,
      });
    }
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "Opps Something Went Wrong, Contact Administrator",
      error: err.message,
    });
  }
};

exports.sellcar = async (req, res) => {
  try {
    const { id } = req.params;
    const { sell_date, sell_executive, selling_price, payment_method } =
      req.body;

    const cardata = await car.findById(id);

    const sellcardata = await car.findByIdAndUpdate(id, {
      sell_date: new Date(sell_date),
      sell_executive: sell_executive,
      margin: selling_price - (cardata.purchase_price + cardata.charges_amount),
      selling_price: selling_price,
      status: "Sold",
      payment_method: payment_method,
    });
    if (sellcardata) {
      await sellcardata.save();

      res.send({
        statusCode: 200,
        massage: "sell Car data Updated Successfully",
        data: sellcardata,
      });
    }
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "Opps Something Want Wrong, Contact Administrator",
      error: err.message,
    });
    /*
    res.status(500).json({
      statusCode: 500,
      message: "Oops Something Went Wrong, Contact Administrator",
      error: error.message,
    });*/
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await user.findByIdAndUpdate(id, {
      $set: { is_deleted: true },
    });

    res.send({
      statusCode: 200,
      massage: "User Deleted Successfully",
      user: deleteUser,
    });
  } catch (err) {
    res.send({
      statusCode: 500,
      massage: "Opps Something Want Wrong, Contact Administrator",
      error: err,
    });
  }
};
exports.addTask = async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  const addTaskData = await task.create({ ...data, car_id: id });
  if (addTaskData) {
    res.send({
      success: true,
      statusCode: 200,
      massage: "Task addedd successfully",
      data: addTaskData,
    });
  } else {
    res.send({
      success: false,
      statusCode: 400,
      massage: "Task addedd failed",
    });
  }
};
