import logger from "morgan";
import cors from "cors";
import helmet from "helmet";

export default (app) => {
  app.use(logger("dev"));
  app.use(cors());
  app.use(helmet());
};
