const express = require("express");
const mongoose = require("mongoose");
const Request = require("../models/requests.model"); 


// Create request
exports.createRequest = async (req, res) => {
  try {
    const { customerId, requestId, serviceType, urgency, description, location, time } = req.body;
    const newRequest = new Request({
      customerId, 
      requestId,
      serviceType,
      urgency,
      description,
      location,
      time,
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};

// Read single request
exports.getRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};
// Get all requests for a specific customer
exports.getRequestsByUser = async (req, res) => {
  try {
    const { customerId } = req.params;

    const userRequests = await Request.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(userRequests);
  } catch (error) {
    res.status(400).json({ message: "Error fetching user requests", error });
  }
};


// Read all requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const updateData = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      updateData,
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const deletedRequest = await Request.findByIdAndDelete(requestId);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};
