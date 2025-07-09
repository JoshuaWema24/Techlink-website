const mongoose = Require('mongoose');
const express = require('express');

const serviceSchema = new mongoose.Schema = {
    serviceName: {
        type: String, 
        required: true,
        unique: true
    },
    serviceInfo: {
        type: String,
        required: true,
    }
};
  
exports.Service = mongoose.model('Service', serviceSchema);

