import express, { Request } from "express";
import { User } from "../models";
import { checkToken } from "../helpers/checkToken";

const router = express.Router();



export { router as auth };