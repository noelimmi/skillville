const Joi = require("joi");
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth')
const express = require('express');
const {
    User
} = require('../models/user');

const router = express.Router();

router.post('/login', async (req, res) => {
    console.log(req.body);

    const {
        error
    } = ValidateLogin(req.body);
    if (error) {
        console.log(error.message);

    }
    if (error) return res.send({
        status: false,
        message: error.details[0].message
    });

    let user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.send({
        status: false,
        message: "Invalid Email or Password"
    });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.send({
        status: false,
        message: "Invalid Password"
    });

    const token = user.generateAuthToken();
    res.send({
        status: true,
        name: user.name,
        token: token
    });
});

router.get('/user', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/register', async (req, res) => {
    const {
        error
    } = ValidateRegister(req.body);
    if (error) return res.send({
        status: false,
        message: error.details[0].message
    });

    let user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.send({
        status: false,
        message: "User already exist"
    });
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();
    res.send({
        status: true,
    });
});

function ValidateLogin(user) {
    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

function ValidateRegister(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}


module.exports = router;