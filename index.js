require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");
const connectDB = require("./utils/db");

const app = express();
const port = process.env.PORT || 4000;

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",  // Local frontend (React)
  "http://localhost:5173",  // Local frontend (Vite)
  "https://admin.broadium.us", // Admin panel (Live)
  "https://broadium.us",
  "https://www.broadium.us" ,
  "http://localhost:3001",
  
    // Main Website (Live)
];

// ✅ Apply CORS Middleware Before Routes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
}));

// ✅ Handle Preflight Requests
app.options("*", cors()); // Allow all OPTIONS requests

// ✅ Middleware
app.use(express.json());

// ✅ Routes
const userRouter = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const viewsRouter = require("./Routes/viewsRoutes");

// ✅ Use Routes
app.use("/", userRouter);
app.use("/admin", adminRoutes);

app.use("/views", viewsRouter);

// ✅ Static Folder for Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Database Connection & Server Start
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on Port: ${port}`);
  });
});
