import express, { Request, Response } from "express";
import { getUser } from "./service";

export const GetCurrentUser = async (req: Request, res: Response) => {
	try {
		console.log("req", req);

		const userId = req.userId;
		if (!userId) {
			return res.status(500).send("users.GetCurrentUser - no userId provided");
		}

		const user = await getUser({ userId });
		return res.send("success");
	} catch (err) {
		return res
			.status(500)
			.send(`users.GetCurrentUser - Error getting users ${err.message}`);
	}
};
