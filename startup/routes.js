import error from "../middleware/Error.js";
import applicantRouter from "../routes/applicant.js";
import contactDetailsRouter from "../routes/contactDetails.js";
import documentsRouter from "../routes/documents.js";
import experienceRouter from "../routes/experience.js";
import imageRouter from "../routes/image.js";
import userRouter from "../routes/user.js";

export default (app) => {
  app.use("/api/applicant", applicantRouter);
  app.use("/api/users", userRouter);
  app.use("/api/applicant/contact_details", contactDetailsRouter);
  app.use("/api/image", imageRouter);
  app.use("/api/applicant/documents", documentsRouter);
  app.use("/api/applicant/experience", experienceRouter);
  app.get("*", (req, res) => {
    res.sendStatus(404);
  });
  app.use(error);
};
