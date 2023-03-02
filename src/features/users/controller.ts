import { Request, Response } from "express";
import { getUser } from "./service";
import { getUserAuth } from "../auth/service";

export const GetCurrentUser = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(500).send("users.GetCurrentUser - no userId provided");
		}

		const userAuth = await getUserAuth({ userId });
		const user = await getUser({ userId });

		const userData = {
			...user,
			role: userAuth.role,
		};

		const returnData = {
			...userData,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(`users.GetCurrentUser - Error getting users ${err.message}`);
	}
};
