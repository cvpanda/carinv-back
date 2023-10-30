const { default: mongoose } = require("mongoose");
const car = require("../models/car");

exports.charges = async (req, res) => {
  const desiredChargeNames = [
    "DyP",
    "Vidrio",
    "Neumáticos",
    "Arreglo mecánico",
    "Arreglo eléctrico",
  ];

  try {
    const { id } = req.params;
    const carsData = await car.find();
    if (carsData) {
      const inventoryData = carsData?.flatMap((value) => value.inventory);
      const data = await car
        .aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(id),
              charges_items: { $exists: true, $ne: [] }, // Filter out documents where charges_items field exists and is not an empty array
              "charges_items.charge_date": { $ne: null }, // Filter out documents where charge_date is null in the charges_items array
            },
          },
          {
            $project: {
              charges_items: "$charges_items",
              createdAt: "$createdAt",
              sell_price: "$selling_price",
              purchase_date: "$purchase_date",
              purchase_price: "$purchase_price",
              charge_date: { $arrayElemAt: ["$charges_items.charge_date", 0] }, //
              status: "$status",
              margin: "$margin",
            },
          },

          {
            $group: {
              _id: { $month: { $toDate: "$charge_date" } }, //{ $month: "$purchase_date" },
              data: { $push: "$$ROOT" },
            },
          },
        ])
        .then((results) => {
          const dataByMonth = {};
          results.forEach((result) => {
            if (result._id !== null) {
              const month = result._id;
              const data = result.data;
              if (!dataByMonth[month]) {
                dataByMonth[month] = [];
              }
              if (!dataByMonth[month]) {
                dataByMonth[month] = [];
              }
              dataByMonth[month] = dataByMonth[month].concat(data);
            }
          });

          return dataByMonth;
        });
      const monthName = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthData = [];
      const output = Object.keys(data).reduce((acc, month) => {
        const charges = data[month].reduce((chargesAcc, item) => {
          item.charges_items.forEach((charge) => {
            if (desiredChargeNames.includes(charge.name)) {
              chargesAcc[charge.name] =
                (chargesAcc[charge.name] || 0) + charge.price;
            }
          });
          if (!chargesAcc["DyP"]) {
            chargesAcc["DyP"] = 0;
          }
          if (!chargesAcc["Vidrio"]) {
            chargesAcc["Vidrio"] = 0;
          }
          if (!chargesAcc["Neumáticos"]) {
            chargesAcc["Neumáticos"] = 0;
          }
          if (!chargesAcc["Arreglo mecánico"]) {
            chargesAcc["Arreglo mecánico"] = 0;
          }
          if (!chargesAcc["Arreglo eléctrico"]) {
            chargesAcc["Arreglo eléctrico"] = 0;
          }
          return chargesAcc;
        }, {});

        monthData.push(monthName[parseInt(month) - 1]);
        acc[month] = {
          ...charges,
        };
        return acc;
      }, {});
      const charges = {};

      for (const monthData of Object.values(output)) {
        const chargesItems = {};

        for (const [chargeName, chargeValue] of Object.entries(monthData)) {
          if (
            chargeName !== "purchase_price" &&
            chargeName !== "sell_price" &&
            chargeName !== "margin" &&
            chargeName !== "new_car_count" &&
            chargeName !== "publish_car_count" &&
            chargeName !== "sold_car_count"
          ) {
            chargesItems[chargeName] = chargeValue;
          }
        }

        for (const [chargeName, chargeValue] of Object.entries(chargesItems)) {
          if (chargeName in charges) {
            charges[chargeName].push(chargeValue);
          } else {
            charges[chargeName] = [chargeValue];
          }
        }
      }
      res.send({
        status: true,
        message: "success",
        data: { charges, monthData },
      });
    } else {
      res.send({
        status: false,
        message: "user id is not matched ",
      });
    }
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
};

exports.purchaseChart = async (req, res) => {
  try {
    const { id } = req.params;
    const purchasedata = await car.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: { $month: { $toDate: "$purchase_date" } },
          totalAmount: { $sum: "$purchase_price" },
          totalCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalAmount: 1,
          totalCount: 1,
        },
      },
    ]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const transformedData = [
      purchasedata.map((item) => months[item.month - 1]),
      purchasedata.map((item) => item.totalAmount),
      purchasedata.map((item) => item.totalCount),
    ];
    res.send({
      status: true,
      message: "success",
      data: transformedData,
    });
  } catch (error) {
    res.send({
      status: false,
      message: "fail",
      data: error.message,
    });
  }
};
exports.marginChart = async (req, res) => {
  try {
    const { id } = req.params;
    const salesdata = await car.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          status: "Sold",
        },
      },
      {
        $group: {
          _id: { $month: { $toDate: "$sell_date" } },
          totalAmount: { $sum: "$margin" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalAmount: 1,
        },
      },
    ]);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const transformedData = [
      salesdata.map((item) => months[item.month - 1]),
      salesdata.map((item) => item.totalAmount),
    ];
    res.send({
      status: true,
      message: "success",
      data: transformedData,
    });
  } catch (error) {
    res.send({
      status: false,
      message: "fail",
      data: error.message,
    });
  }
};
exports.salesChart = async (req, res) => {
  try {
    const { id } = req.params;
    const salesdata = await car.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          status: "Sold",
        },
      },
      {
        $group: {
          _id: { $month: { $toDate: "$sell_date" } },
          totalAmount: { $sum: "$selling_price" },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalAmount: 1,
        },
      },
    ]);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const transformedData = [
      salesdata.map((item) => months[item.month - 1]),
      salesdata.map((item) => item.totalAmount),
    ];
    res.send({
      status: true,
      message: "success",
      data: transformedData,
    });
  } catch (error) {
    res.send({
      status: false,
      message: "fail",
      data: error.message,
    });
  }
};
exports.inventoryChart = async (req, res) => {
  try {
    const { id } = req.params;
    const carsdata = await car.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
          status: { $in: ["New Car", "Publish"] }, // Match "New Car" or "Publish" status
        },
      },
      {
        $project: {
          purchase_date: 1,
        },
      },
    ]);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day (00:00:00)
    const inventoryCount = {
      "1-30": 0,
      "30-60": 0,
      "60-90": 0,
      "90+": 0,
    };

    carsdata.map((item) => {
      const purchaseDate = new Date(item.purchase_date);
      const daysDifference = Math.floor(
        (currentDate - purchaseDate) / (1000 * 60 * 60 * 24)
      );
      if (daysDifference >= 1 && daysDifference <= 30) {
        inventoryCount["1-30"]++;
      } else if (daysDifference > 30 && daysDifference <= 60) {
        inventoryCount["30-60"]++;
      } else if (daysDifference > 60 && daysDifference <= 90) {
        inventoryCount["60-90"]++;
      } else if (daysDifference > 90) {
        inventoryCount["90+"]++;
      }
    });
    res.send({
      status: true,
      message: "success",
      data: Object.values(inventoryCount),
    });
  } catch (error) {
    res.send({
      status: false,
      message: "fail",
      data: error.message,
    });
  }
};
