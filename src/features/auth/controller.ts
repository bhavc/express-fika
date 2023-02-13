import { NextFunction, Request, Response } from "express";
import { createUserProfile } from "../users/service";
import { jwtSign, jwtVerify, loginUser, registerUser } from "./service";

export const Authorize = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// i have the jwt from the header
		// pull the jwt out
		const authHeader = req.headers["authorization"];
		if (!authHeader) {
			return res.status(401).send(`auth.controller:Authorize - Unauthorized`);
		}

		const bearer = authHeader.split(" ");
		const bearerToken = bearer[1];

		if (!bearerToken) {
			return res
				.status(401)
				.send(`auth.controller:Authorize - Unauthorized, no bearer token`);
		}

		type DecodedTokenType = {
			id: string;
			iat: number;
		};

		const decodedToken = (await jwtVerify(bearerToken)) as DecodedTokenType;
		if (!decodedToken) {
			return res
				.status(401)
				.send(`auth.controller:Authorize - Unauthorized, no bearer token`);
		}

		const userId = decodedToken.id;

		req.userId = userId;

		next();
	} catch (err) {
		return res
			.status(500)
			.send(`auth.controller:Authorize - Error verifying token ${err.message}`);
	}
};

export const Register = async (req: Request, res: Response) => {
	try {
		const { body } = req;
		if (!body || !body.email || !body.password || !body.role) {
			return res.status(400).send("AuthController:Register - Missing data");
		}

		const { email, password, company, role } = body;

		let user = await registerUser({
			email,
			password,
			role,
		});
		await createUserProfile({ id: user.id, company });
		const jwtToken = await jwtSign({ id: user.id });

		const response = {
			token: jwtToken,
		};

		return res.status(200).json(response);
	} catch (err) {
		return res
			.status(500)
			.send(
				`auth.controller:Register - Error registering users ${err.message}`
			);
	}
};

export const Login = async (req: Request, res: Response) => {
	try {
		const { body } = req;
		if (!body || !body.email || !body.password) {
			return res.status(400).send("AuthController:Login - Missing data");
		}

		const { email, password } = body;

		let user = await loginUser({ email, password });

		const jwtToken = await jwtSign({ id: user.id });

		const response = {
			token: jwtToken,
		};

		return res.status(200).json(response);
	} catch (err) {
		return res
			.status(500)
			.send(
				`auth.controller:Register - Error registering users ${err.message}`
			);
	}
};
