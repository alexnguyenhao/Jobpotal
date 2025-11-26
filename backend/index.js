import express from "express"; // Vẫn giữ để dùng các type nếu cần, nhưng app lấy từ socket.js
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import categoryRoute from "./routes/jobcategory.route.js";
import cvRoute from "./routes/cv.route.js";
import careerGuideRoute from "./routes/careerGuide.route.js";
import notificationRoute from "./routes/notification.route.js";
import adminRoute from "./routes/admin.route.js";

import { app, server } from "./socket.js";

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

//api's
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/cv", cvRoute);
app.use("/api/v1/career-guides", careerGuideRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/admin", adminRoute);

// --- THAY ĐỔI 2: Dùng server.listen thay vì app.listen ---
server.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
