import express, { Request, Response } from "express";
import cors from "cors";
import roters from "./db";

const app = express();
const port = 5000;

app.use(cors());

const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); +

app.use("/admin", roters);

app.listen(port, () => console.log(`app listening on port ${port}!`));
