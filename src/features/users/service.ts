import { Db } from "../../core/database";

import { Role } from "../auth/types";
import { CarrierProfileType } from "./types";

export const createUserProfile = async ({
	id,
	company,
}: {
	id: number;
	company: string;
}) => {
	try {
		const data = await Db.insertInto("users")
			.values({
				id,
				company_name: company,
			})
			.executeTakeFirstOrThrow();

		const userProfile = {
			company,
		};

		return userProfile;
	} catch (err) {
		throw new Error(
			`users.service: createUserProfile - Error creating users profile ${err.message}`
		);
	}
};

export const getUserProfile = async ({ userId }: { userId: string }) => {
	try {
		const numericId = parseInt(userId, 10);

		const data = await Db.selectFrom("users")
			.selectAll()
			.where("id", "=", numericId)
			.executeTakeFirstOrThrow();

		return data;
	} catch (err) {
		throw new Error(
			`users.service: getUserProfile - Error getting users ${err.message}`
		);
	}
};

const editUserCarrierProfile = async ({
	userId,
	carrierData,
}: {
	userId: number;
	carrierData: CarrierProfileType;
}) => {
	try {
		const data = await Db.updateTable("users")
			.set(carrierData)
			.where("id", "=", userId)
			.executeTakeFirstOrThrow();

		return data.numUpdatedRows;
	} catch (err) {
		throw new Error(
			`users.service: editUserCarrierProfile - Error editing user ${err.message}`
		);
	}
};

export const editUserProfile = async ({
	userId,
	userRole,
	data,
}: {
	userId: string;
	userRole: Role;
	data: unknown;
}) => {
	try {
		const numericId = parseInt(userId, 10);

		if (userRole === "Carrier") {
			const carrierData = data as CarrierProfileType;

			const numUpdatedRows = await editUserCarrierProfile({
				userId: numericId,
				carrierData,
			});

			return numUpdatedRows;
		}
	} catch (err) {
		throw new Error(
			`users.service: editUserProfile - Error editing user ${err.message}`
		);
	}
};
