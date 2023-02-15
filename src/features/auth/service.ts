import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Db } from "../../core/database";
import { Role, Status } from "./types";

const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 10);
};

const comparePassword = async (password: string, hash: string) => {
	const isSame = bcrypt.compare(password, hash);
	return isSame;
};

export const jwtSign = async (payload: { id: number }) => {
	const token = jwt.sign(payload, process.env.PRIVATE_JWT_KEY, {
		expiresIn: "24h",
	});
	return token;
};

export const jwtVerify = async (token: string) => {
	try {
		const decoded = jwt.verify(token, process.env.PRIVATE_JWT_KEY);
		return decoded;
	} catch (err) {
		throw new Error(
			`auth.service:jwtVerify - Error verifying JWT ${err.message}`
		);
	}
};

export const loginUser = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}) => {
	try {
		const data = await Db.selectFrom("auth")
			.selectAll()
			.where("email", "=", email)
			.execute();

		const user = data[0];
		if (!user) {
			throw new Error("auth.service:loginUser - User does not exist.");
		}

		const isSamePassword = await comparePassword(password, user.password);
		if (!isSamePassword) {
			throw new Error("auth.service:loginUser - Incorrect password.");
		}

		return user;
	} catch (err) {
		throw new Error(
			`auth.service:loginUser - Error logging in user ${err.message}`
		);
	}
};

export const registerUser = async ({
	email,
	password,
	role,
}: {
	email: string;
	password: string;
	role: Role;
}) => {
	try {
		// create function that will create user depending on role
		const data = await Db.selectFrom("auth")
			.select("id")
			.where("email", "=", email)
			.execute();

		if (data && data.length > 0) {
			throw new Error(
				`auth.service:registerUser - a user is already registered with this email`
			);
		}

		const status: Status = "Activated";
		const hashedPassword = await hashPassword(password);

		const { id: userId } = await Db.insertInto("auth")
			.values({
				email,
				password: hashedPassword,
				role,
				status,
			})
			.returning("id")
			.executeTakeFirstOrThrow();

		const user = {
			id: userId,
			email,
			password: hashedPassword,
			role,
			status,
		};

		return user;
	} catch (err) {
		throw new Error(
			`auth.service:registerUser - Error registering user ${err.message}`
		);
	}
};
