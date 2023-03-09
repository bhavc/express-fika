import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Pool } from "pg";

import { AuthRouter } from "./features/auth/router";
import { FileRouter } from "./features/files/router";
import { UserRouter } from "./features/users/router";
import { WorkflowRouter } from "./features/workflows/router";

dotenv.config();

const app = express();
const port = process.env.PORT;

(async () => {
	// Check db health and maybe graceful shutdown
	const db = new Pool({
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DATABASE,
		host: process.env.POSTGRES_HOST,
	});

	db.query("SELECT NOW();", (err, res) => {
		if (err) {
			console.log("There was an error connecting to db", err);
			return;
		}
		console.log("DB is up at: ", res.rows[0].now);
		db.end();
	});

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	app.use(cors());

	app.get("/", (_, res) => {
		res.send("Express + TypeScript Server");
	});

	app.use("/auth", AuthRouter);
	app.use("/fileUpload", FileRouter);
	app.use("/user", UserRouter);
	app.use("/workflow", WorkflowRouter);

	app.listen(port, () => {
		console.info(`[server]: Server is running at http://localhost:${port}`);
	});
})();
