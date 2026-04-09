import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import foodModel from "./models/foodModel.js";
import { food_list } from "./seed.js";

// app config
const app = express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Seed initial foods
app.get("/api/seed", async (req, res) => {
  try {
    await foodModel.deleteMany({}); // optional: clears existing foods
    const createdFoods = await foodModel.insertMany(food_list);
    res.send(createdFoods);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
