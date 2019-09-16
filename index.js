const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const auth = require("./route/auth");
const cors = require('cors');
const morgan = require('morgan');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
//console.log(process.env.JWT_SIGN);
// if (!config.get(' ')) {
//     console.error('Fatal error:jwtPrivateKey is not defined');
//     process.exit(1);
// }


const app = express();
app.use(cors());
app.use(morgan("dev"));

mongoose
    .connect("mongodb://localhost/skillville", {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected Successfully");
    })
    .catch(() => {
        console.error("error", err);
    });

app.use(express.json());
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});