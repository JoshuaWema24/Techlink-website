const mongoose = require('mongoose');
const express = require('express');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    county: {
        type: String,
        required: true,
    },
    subcounty: {
        type: String,
        required: true,
    },
    estate: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Customer', customerSchema);