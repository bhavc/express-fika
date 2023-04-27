import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { Db } from "../../core/database";
import { Role, AuthStatus } from "./types";

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
	emailUsername,
	password,
}: {
	emailUsername: string;
	password: string;
}) => {
	try {
		const emailResult = await Db.selectFrom("auth")
			.selectAll()
			.where("email", "=", emailUsername)
			.executeTakeFirst();

		const userNameResult = await Db.selectFrom("auth")
			.selectAll()
			.where("username", "=", emailUsername)
			.executeTakeFirst();

		if (!emailResult && !userNameResult) {
			throw new Error("auth.service:loginUser - User does not exist.");
		}

		const user = emailResult ? emailResult : userNameResult;

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

export const createAuthUser = async ({
	email,
	password,
	role,
}: {
	email: string;
	password: string;
	role: Role;
}) => {
	try {
		const data = await Db.selectFrom("auth")
			.select("id")
			.where("email", "=", email)
			.execute();

		if (data && data.length > 0) {
			throw new Error(
				`auth.service:createAuthUser - a user is already registered with this email`
			);
		}

		// TODO we will put all users that are not admins into pending
		const registerStatus: AuthStatus = ["Carrier", "Driver"].includes(role)
			? "Pending"
			: "Activated";

		const hashedPassword = await hashPassword(password);

		const { id: userId } = await Db.insertInto("auth")
			.values({
				email,
				password: hashedPassword,
				role,
				status: registerStatus,
			})
			.returning("id")
			.executeTakeFirstOrThrow();

		const user = {
			id: userId,
			email,
			password: hashedPassword,
			role,
			status: registerStatus,
		};

		return user;
	} catch (err) {
		throw new Error(
			`auth.service:createAuthUser - Error registering user ${err.message}`
		);
	}
};

export const getUserAuth = async ({ userId }: { userId: string }) => {
	try {
		const numericId = parseInt(userId, 10);

		const data = await Db.selectFrom("auth")
			.selectAll()
			.where("id", "=", numericId)
			.execute();

		const user = data[0];
		if (!user) {
			throw new Error("auth.service:loginUser - User does not exist.");
		}

		return user;
	} catch (err) {
		throw new Error(
			`auth.service:loginUser - Error logging in user ${err.message}`
		);
	}
};

export const createAuthDriver = async ({
	driverEmail,
	driverPassword,
	driverUsername,
}: {
	driverEmail?: string;
	driverPassword: string;
	driverUsername: string;
}) => {
	try {
		const previousUsernameResult = await Db.selectFrom("auth")
			.select("id")
			.where("username", "=", driverUsername)
			.execute();

		if (previousUsernameResult && previousUsernameResult.length > 0) {
			throw new Error(
				`auth.service:createAuthDriver - a user is already registered with this email`
			);
		}

		// TODO we will put all users that are not admins into pending
		const driverStatus: AuthStatus = "Pending";
		const driverRole: Role = "Driver";

		const hashedPassword = await hashPassword(driverPassword);

		const createAuthDriverResult = await Db.insertInto("auth")
			.values({
				email: driverEmail,
				username: driverUsername,
				password: hashedPassword,
				role: driverRole,
				status: driverStatus,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		const user = {
			id: createAuthDriverResult.id,
			email: createAuthDriverResult.email,
			username: createAuthDriverResult.username,
			password: hashedPassword,
			role: createAuthDriverResult.role,
			status: createAuthDriverResult.status,
		};

		return user;
	} catch (err) {
		throw new Error(
			`auth.service:createAuthDriver - Error registering user ${err.message}`
		);
	}
};
