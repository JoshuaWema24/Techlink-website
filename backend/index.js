const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =
  "mongodb+srv://wotiajoshua:joshuawema@cluster0.quv4pzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB Atlas successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
run();

// Routes
const customerControllers = require("./controllers/customer.controller");
app.post("/customerSignUp", customerControllers.createCustomer);
app.get("/getCustomers", customerControllers.getCustomers);
app.get("/getCustomer/:name", customerControllers.getCustomer);
app.put("/updateCustomer/:name", customerControllers.updateCustomer);
app.delete("/deleteCustomer/:name", customerControllers.deleteCustomer);

const requestControllers = require("./controllers/request.controllers");
app.post("/api/request-service", requestControllers.createRequest);

const technicianController = require("./controllers/technicians.controllers");
app.post("/techniciansSignUp", technicianController.createTechnician);
app.get("/getTechnicians", technicianController.getTechnicians);
app.get("/getTechnician/:name", technicianController.getTechnician);
app.put("/updateTechnicians/:name", technicianController.updateTechnician);
app.delete("/deleteTechnicians/:name", technicianController.deleteTechnician);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
