import { NextFunction, Request, Response } from "express";
import { createUserProfile, getUserProfile } from "../users/service";
import {
	jwtSign,
	jwtVerify,
	loginUser,
	createAuthUser,
	createAuthDriver,
} from "./service";

export const Authorize = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

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

		const user = await createAuthUser({
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
		if (!body || !body.emailUsername || !body.password) {
			return res.status(400).send("AuthController:Login - Missing data");
		}

		const { emailUsername, password } = body;

		const userAuth = await loginUser({ emailUsername, password });
		const userProfile = await getUserProfile({ userId: `${userAuth.id}` });

		const jwtToken = await jwtSign({ id: userAuth.id });

		const response = {
			token: jwtToken,
			user: {
				...userProfile,
				role: userAuth.role,
			},
		};

		return res.status(200).json(response);
	} catch (err) {
		return res
			.status(500)
			.send(
				`auth.controller:Login - Error logging in user users ${err.message}`
			);
	}
};

export const OnboardDriver = async (req: Request, res: Response) => {
	try {
		const { body } = req;
		const {
			driverAddress,
			driverEmail,
			driverEmergencyPhone,
			driverFirstName,
			driverLastName,
			driverPassword,
			driverPhone,
			driverUsername,
			companyName,
		} = body;

		if (
			!body ||
			!driverUsername ||
			!driverPassword ||
			!driverPhone ||
			!companyName
		) {
			return res
				.status(400)
				.send("AuthController:OnboardDriver - Missing required driver data");
		}

		const authDriver = await createAuthDriver({
			driverPassword,
			driverUsername,
			driverEmail,
		});

		const driverProfile = await createUserProfile({
			id: authDriver.id,
			company: companyName,
			address: driverAddress,
			phoneNumber: driverPhone,
			emergencyPhone: driverEmergencyPhone,
			firstName: driverFirstName,
			lastName: driverLastName,
		});

		const response = {
			message: "Successfully created user",
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
