import express from "express";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";

const imageRouter = express.Router();

imageRouter.post("/", upload.single("image"), async (req, res) => {
  if (!req.file)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "A file is required!" });
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const { secure_url, public_id } = result;
    return res.status(201).json({ secure_url, public_id });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

imageRouter.delete("/", async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.body.public_id);
    return res.status(StatusCodes.OK).send(result);
  } catch (err) {
    res.status(err.http_code).send(err);
  }
});

export default imageRouter;
