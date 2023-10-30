const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

module.exports = {
  verifyAccessToken: async (req, res, next) => {
    if (!req.headers["authorization"]) {
      return res.json({ massage: "Access Denied" });
    }
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (token === "null" || token === "undefined") {
      res.json({ massage: "Access Denied" });
    } else {
      const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_POOL_ID,
        tokenUse: "access",
        clientId: process.env.COGNITO_CLIENT_ID,
      });

      try {
        const payload = await verifier.verify(token);
        const emailverifyData = await user.findOne({
          user_sub: payload?.username,
        });

        if (emailverifyData) {
          next();
        } else {
          res.json({ massage: "User Not Found" });
        }
      } catch (err) {
        res.json({
          massage: "User Not Found",
          errpr: err.message,
          statusCode: 401,
        });
      }
    }
  },
};
