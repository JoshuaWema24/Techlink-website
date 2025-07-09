const mongoose = require("mongoose");
const express = require("express");
const Customer = require("../models/customer.model");
const bcrypt = require("bcrypt");
const customerModel = require("../models/customer.model");

// Create a new customer
exports.createCustomer = async (req, res) => {
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
    } = req.body;

    console.log("Received customer data:", req.body);

    // Validate required fields
    if (!name || !email || !phonenumber || !country || !county || !subcounty || !estate || !password) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ message: "Customer with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new customer
    const newCustomer = new Customer({
      name,
      email,
      phonenumber,
      country,
      county,
      subcounty,
      estate,
      password: hashedPassword,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
    
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
//get customer
exports.getCustomer = async(req, res) => {
    try {
       const { name } = req.params;
           const customer = await Customer.findOne({ name });
           if (!customer) {
             return res.status(404).json({ message: 'customer not found' });
           }
     res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ message: 'Server error'})
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};

// Update a customer by name
exports.updateCustomer = async (req, res) => {
  try {
    const { name } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
      { name },
      updateData,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};

// Delete a customer by name
exports.deleteCustomer = async (req, res) => {
  try {
    const { name } = req.params;
    const deletedCustomer = await Customer.findOneAndDelete({ name });

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};
