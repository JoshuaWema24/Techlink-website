const mongoose = require('mongoose');
const Technician = require('../models/technicians.model');
const bcrypt = require('bcrypt');
const express = require('express');


// Create technician
exports.createTechnician = async (req, res) => {
  try {
    const {
      name,
      email,
      phonenumber,
      country,
      county,
      subcounty,
      estate,
      password,
      jobtype
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTechnician = new Technician({
      name,
      email,
      phonenumber,
      country,
      county,
      subcounty,
      estate,
      password: hashedPassword,
      jobtype
    });

    const savedTechnician = await newTechnician.save();
    res.status(201).json(savedTechnician);
  } catch (error) {
    res.status(400).json({ message: 'Error creating technician', error });
  }
};

// Get all technicians
exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find();
    if (!technicians.length) {
      return res.status(404).json({ message: 'No technicians found' });
    }
    res.status(200).json(technicians);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching technicians', error });
  }
};

// Get technician by name
exports.getTechnician = async (req, res) => {
  try {
    const { name } = req.params;
    const technician = await Technician.findOne({ name });
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    res.status(200).json(technician);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching technician', error });
  }
};

// Update technician by name
exports.updateTechnician = async (req, res) => {
  try {
    const { name } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await Technician.findOneAndUpdate({ name }, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating technician', error });
  }
};

// Delete technician
exports.deleteTechnician = async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await Technician.findOneAndDelete({ name });
    if (!deleted) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    res.status(200).json({ message: 'Technician deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting technician', error });
  }
};
