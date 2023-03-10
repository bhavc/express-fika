import { Request, Response } from "express";
import { getUserProfile, editUserProfile } from "./service";
import { getUserAuth } from "../auth/service";

export const GetCurrentUser = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(500).send("users.GetCurrentUser - no userId provided");
		}

		const userAuth = await getUserAuth({ userId });
		const user = await getUserProfile({ userId });

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

export const EditUser = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(500).send("users.EditUser - no userId provided");
		}

		if (!req.body) {
			return res.status(500).send("users.EditUser - no body params provided");
		}

		const data = req.body;

		const userAuth = await getUserAuth({ userId });
		const userRole = userAuth.role;

		await editUserProfile({ userId, userRole, data });

		const returnData = {
			message: "Successfully updated user",
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(`users.EditUser - Error editing user ${err.message}`);
	}
};
