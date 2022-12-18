import logger from "morgan";
import cors from "cors";

export default (app) => {
    app.use(logger("dev"));
    app.use(cors());
}