const user = require("../models/user");
const bcrypt = require("bcrypt");

const { default: axios } = require("axios");
const saltRounds = 10;

exports.readUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await user.findOne({ _id: id, is_deleted: false });

    res.send({
      statusCode: 200,
      massage: "user fetch successfully",
      data: userData,
    });
  } catch (err) {
    res.send({ statusCode: 500, massage: "user fetch fail", error: err });
  }
};
exports.alluser = async (req, res) => {
  try {
    const alluser = await user.find({ is_deleted: false });

    res.send({
      statusCode: 200,
      massage: "user fetch successfully",
      data: alluser,
    });
  } catch (err) {
    res.send({ statusCode: 500, massage: "user fetch fail", error: err });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emails = await user.find({ email: email });
    if (emails.length === 0) {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          req.body.password = hash;
          const newUser = await user.create(req.body);
          if (newUser) {
            await newUser.save();
            res.send({ statusCode: 200, massage: "user succesfully created" });
          }
        });
      });
    } else {
      res.send({
        statusCode: 500,
        massage: "Email Already Exist Try Other Email",
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

exports.login = async (req, res) => {
  try {
    const { user_sub } = req.body;

    const userData = await user.findOne({ user_sub: user_sub });

    if (!userData) {
      res.send({ statusCode: 404, massage: "User Not Found" });
    } else {
      res.send({
        statusCode: 200,
        massage: "user Succesfully login",
        data: userData,
        token: req.headers["authorization"].split(" ")[1],
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
exports.addcompany = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers["authorization"].split(" ")[1];
    const companyData = await user.findByIdAndUpdate(
      id,
      {
        $set: { company_details: req.body },
      },
      { new: true }
    );
    if (!companyData) {
      res.send({ statusCode: 404, massage: "company detail Not created" });
    } else {
      await companyData.save();
      res.send({
        statusCode: 200,
        massage: "company detail Succesfully create",
        data: companyData,
        token: token,
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
