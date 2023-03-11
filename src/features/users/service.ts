import { Db, toJson } from "../../core/database";

import type { Role } from "../auth/types";
import type { CarrierProfileType } from "./types";
import type { FileType } from "../files/type";

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
		console.log("carrier data", carrierData);
		const {
			clientCompanyName,
			clientCompanyAddress,
			clientCompanyPhone,
			clientCompanyEmergencyPhone,
			clientRegionsServiced,
			clientAreasServiced,
			clientLanguagesSupported,
			clientHasSmartphoneAccess,
			clientHasLiveTracking,
			clientHasDashcam,
		} = carrierData;

		const carrierDataDb: { [key: string]: any } = {};

		if (clientCompanyName) {
			carrierDataDb.company_name = clientCompanyName;
		}

		if (clientCompanyAddress) {
			carrierDataDb.company_address = clientCompanyAddress;
		}

		if (clientCompanyPhone) {
			carrierDataDb.phone_number = clientCompanyPhone;
		}

		if (clientCompanyEmergencyPhone) {
			carrierDataDb.emergency_numbers = clientCompanyEmergencyPhone;
		}

		if (clientRegionsServiced) {
			carrierDataDb.region_serviced = clientRegionsServiced;
		}

		if (clientAreasServiced) {
			carrierDataDb.areas_serviced = clientAreasServiced;
		}

		// TODO fix this
		if (clientLanguagesSupported) {
			let formattedLanguagesSupported;
			if (!Array.isArray(clientLanguagesSupported)) {
				formattedLanguagesSupported = clientLanguagesSupported.split(",");
			} else {
				formattedLanguagesSupported = clientLanguagesSupported;
			}

			carrierDataDb.languages_supported = formattedLanguagesSupported;
		}

		if (clientHasSmartphoneAccess) {
			carrierDataDb.smartphone_access = clientHasSmartphoneAccess;
		}

		if (clientHasLiveTracking) {
			carrierDataDb.livetracking_available = clientHasLiveTracking;
		}

		if (clientHasDashcam) {
			carrierDataDb.dashcam_setup = clientHasDashcam;
		}

		const data = await Db.updateTable("users")
			.set(carrierDataDb)
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

export const editUserProfileImage = async ({
	userId,
	profileImageData,
}: {
	userId: string;
	profileImageData: FileType;
}) => {
	try {
		const numericId = parseInt(userId, 10);

		const profileImageDataDb = {
			name: profileImageData.name,
			type: profileImageData.type,
			blobName: profileImageData.blobName,
		};

		const updateResult = await Db.updateTable("users")
			.set({
				avatar_image_data: toJson(profileImageDataDb),
			})
			.where("id", "=", numericId)
			.executeTakeFirstOrThrow();

		return updateResult.numUpdatedRows;
	} catch (err) {
		throw new Error(
			`users.service: editUserProfileImage - Error editing user ${err.message}`
		);
	}
};
