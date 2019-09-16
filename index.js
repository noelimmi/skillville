const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose
    .connect(
        "mongodb://localhost/skillville", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    )
    .then(() => {
        console.log("Connected Successfully");
    })
    .catch(() => {
        console.error("error", err);
    });

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});