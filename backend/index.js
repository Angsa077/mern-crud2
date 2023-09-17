import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});