import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import { UserRouter } from "./features/users/router";
import { AuthRouter } from "./features/auth/router";

dotenv.config();

const app = express();
const port = process.env.PORT;

(async () => {
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	// app.use(bodyParser.urlencoded({ extended: false }));
	// app.use(bodyParser.json());
	app.use(cors());

	app.get("/", (_, res) => {
		res.send("Express + TypeScript Server");
	});

	app.use("/user", UserRouter);
	app.use("/auth", AuthRouter);

	app.listen(port, () => {
		console.info(`[server]: Server is running at http://localhost:${port}`);
	});
})();
