import express, { Router } from "express";
// import { router } from "./routes/books";
import { handError } from "./middlewares/errorHandler";
import { time } from "./middlewares/reqTime";
import * as swaggerDocument from "./public/swagger.json";
import { PassingRq } from "./middlewares/passingReq";
import swaggerUi from "swagger-ui-express"
import route from "./routes/user";
import router from "./routes/verify";
import authRouter from "./auth";
// import routes from "./auth";

// Swagger-TESTING

// express app
export const app = express();

// Global Middleware
app.use(express.json()); // middleware convert json from req.body to object

app.use(PassingRq); // middleware of  passing the request
app.use(time); // middleware time
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//  connect to route
app.use("/api/user", route);
app.use("/api/user", router)


// app.use("/" , routes)
app.use('/', authRouter)

// Global Error Handler
app.use(handError);

export default app;
