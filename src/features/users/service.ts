import { Db } from "../../core/database";

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

export const getUser = async ({ userId }: { userId: string }) => {
	try {
		const numericId = parseInt(userId, 10);

		const data = await Db.selectFrom("users")
			.selectAll()
			.where("id", "=", numericId)
			.executeTakeFirstOrThrow();

		return data;
	} catch (err) {
		throw new Error(
			`users.service: getUsers - Error getting users ${err.message}`
		);
	}
};
