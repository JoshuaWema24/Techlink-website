const express = require("express");
const mongoose = require("mongoose");

const technicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true
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
  },
  jobtype: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Technician", technicianSchema);
