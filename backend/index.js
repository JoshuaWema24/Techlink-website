const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("./middleware/auth");
const Customer = require("./models/customer.model");
const Technician = require("./models/technicians.model");
const path = require("path");


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

app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  let UserModel;
  if (role === "customer") UserModel = require("./models/customer.model");
  else if (role === "technician")
    UserModel = require("./models/technicians.model");
  else return res.status(400).json({ message: "Invalid role" });

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role }, "joshujoshu", {
      expiresIn: "1d",
    });

   

const userObj = user.toObject();
delete userObj.password;

res.json({ token, user: userObj });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//=====profile section=====///



// Image storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// GET /profile
app.get("/profile", auth, async (req, res) => {
  const { id, role } = req.user;
  const Model = role === "customer" ? Customer : Technician;

  try {
    const user = await Model.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /profile/update
app.post(
  "/profile/update",
  auth,
  upload.single("profilePicture"),
  async (req, res) => {
    const { id, role } = req.user;
    const Model = role === "customer" ? Customer : Technician;

    try {
      const updates = JSON.parse(req.body.profileData);
      if (req.file) {
        updates.profilePicture = `http://localhost:3000/uploads/${req.file.filename}`;
      }

      const updatedUser = await Model.findByIdAndUpdate(id, updates, {
        new: true,
      }).select("-password");
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  }
);



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
app.post("/technicianSignUp", technicianController.createTechnician);
app.get("/getTechnicians", technicianController.getTechnicians);
app.get("/getTechnician/:name", technicianController.getTechnician);
app.put("/updateTechnicians/:name", technicianController.updateTechnician);
app.delete("/deleteTechnicians/:name", technicianController.deleteTechnician);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
