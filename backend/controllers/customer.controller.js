const mongoose = require('mongoose');
const express = require('express');
const Customer = require('../models/customer.model');
const bcrypt = require('bcrypt');

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        const { name, email, phonenumber, country, county, subcounty, estate, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCustomer = new Customer({
            name,
            email,
            phonenumber,
            country,
            county,
            subcounty,
            estate, 
            password: hashedPassword
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: 'Server error', error });
    }
};

// Get one customer by name
exports.getCustomer = async (req, res) => {
    try {
        const { name } = req.params;
        const foundCustomer = await Customer.findOne({ name });

        if (!foundCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(foundCustomer);
    } catch (error) {
        res.status(400).json({ message: 'Server error', error });
    }
};

// Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();

        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: 'No customers found' });
        }

        res.status(200).json(customers);
    } catch (error) {
        res.status(400).json({ message: 'Server error', error });
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
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: 'Server error', error });
    }
};

// Delete a customer by name
exports.deleteCustomer = async (req, res) => {
    try {
        const { name } = req.params;
        const deletedCustomer = await Customer.findOneAndDelete({ name }); 

        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Server error', error });
    }
};
