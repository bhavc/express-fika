import { Db, toJson } from "../../core/database";
import { sql } from "kysely";

import type { AuthStatus, Role } from "../auth/types";
import type { CarrierProfileType, DriverType, UserProfile } from "./types";
import type { FileType } from "../files/type";

export const createUserProfile = async ({
	id,
	company,
	address,
	phoneNumber,
	emergencyPhone,
	firstName,
	lastName,
	driverFiles,
}: {
	id: number;
	company: string;
	address?: string;
	phoneNumber?: string;
	emergencyPhone?: string;
	firstName?: string;
	lastName?: string;
	driverFiles?: any[];
}) => {
	try {
		const createUserToDb: { [key: string]: any } = {
			id,
			company_name: company,
			address,
			phone_number: phoneNumber,
			emergency_numbers: [emergencyPhone],
			first_name: firstName,
			last_name: lastName,
		};

		if (driverFiles && driverFiles.length > 0) {
			createUserToDb.driver_file_data = driverFiles;
		}

		await Db.insertInto("users")
			.values(createUserToDb)
			.executeTakeFirstOrThrow();

		const userProfile = {
			company,
			address,
			phoneNumber,
			emergencyNumbers: [emergencyPhone],
			firstName,
			lastName,
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

		const userProfile: UserProfile = {
			id: data.id,
			firstName: data.first_name,
			lastName: data.last_name,
			companyName: data.company_name,
			address: data.address,
			phoneNumber: data.phone_number,
			emergencyNumbers: data.emergency_numbers,
			gender: data.gender,
			languagesSupported: data.languages_supported,
			hasSmartphoneAccess: data.has_smartphone_access,
			hasLivetrackingAvailable: data.has_livetracking_available,
			hasDashcamSetup: data.has_dashcam_setup,
			areasServiced: data.areas_serviced,
			regionServiced: data.regions_serviced,
			avatarImageData: data.avatar_image_data,
			insuranceFileData: data.insurance_file_data,
			bucketStorageUrls: data.bucket_storage_urls,
			driverFileData: data.driver_file_data,
		};

		return userProfile;
	} catch (err) {
		throw new Error(
			`users.service: getUserProfile - Error getting users ${err.message}`
		);
	}
};

const editUserDriverProfile = async ({
	userId,
	driverData,
}: {
	userId: number;
	driverData: DriverType;
}) => {
	try {
		const {
			driverCompanyName,
			driverAddress,
			driverFirstName,
			driverLastName,
			driverPhoneNumber,
		} = driverData;

		const driverDataDb: { [key: string]: any } = {};

		if (driverCompanyName || driverCompanyName === "") {
			driverDataDb.company_name = driverCompanyName;
		}

		if (driverAddress) {
			driverDataDb.address = driverAddress;
		}

		if (driverFirstName) {
			driverDataDb.first_name = driverFirstName;
		}

		if (driverLastName) {
			driverDataDb.last_name = driverLastName;
		}

		if (driverPhoneNumber) {
			driverDataDb.phone_number = driverPhoneNumber;
		}

		const data = await Db.updateTable("users")
			.set(driverDataDb)
			.where("id", "=", userId)
			.executeTakeFirstOrThrow();

		return data.numUpdatedRows;
	} catch (err) {
		throw new Error(
			`users.service: editUserCarrierProfile - Error editing user ${err.message}`
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
		const {
			clientCompanyName,
			clientCompanyAddress,
			clientCompanyPhone,
			clientCompanyEmergencyPhone,
			carrierInsuranceFiles,
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
			carrierDataDb.address = clientCompanyAddress;
		}

		if (clientCompanyPhone) {
			carrierDataDb.phone_number = clientCompanyPhone;
		}

		if (clientCompanyEmergencyPhone) {
			carrierDataDb.emergency_numbers = [clientCompanyEmergencyPhone];
		}

		if (carrierInsuranceFiles) {
			carrierDataDb.insurance_file_data = carrierInsuranceFiles.map((file) => {
				return {
					name: file.name,
					type: file.type,
					blobName: file.blobName,
				};
			});
		}

		if (clientRegionsServiced) {
			carrierDataDb.regions_serviced = clientRegionsServiced;
		}

		if (clientAreasServiced) {
			carrierDataDb.areas_serviced = clientAreasServiced;
		}

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
			carrierDataDb.has_smartphone_access = clientHasSmartphoneAccess;
		}

		if (clientHasLiveTracking) {
			carrierDataDb.has_livetracking_available = clientHasLiveTracking;
		}

		if (clientHasDashcam) {
			carrierDataDb.has_dashcam_setup = clientHasDashcam;
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
		} else if (userRole === "Driver") {
			const driverData = data as DriverType;

			const numUpdatedRows = await editUserDriverProfile({
				userId: numericId,
				driverData,
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

export const getCarriersByRegion = async ({
	geographicRegion,
	isWithinCountry,
}: {
	geographicRegion: string;
	isWithinCountry: boolean;
}) => {
	try {
		let query;
		if (isWithinCountry) {
			query = sql`${geographicRegion} = ANY (areas_serviced) AND auth.status = 'Activated'`;
		} else {
			query = sql`${geographicRegion} = ANY (areas_serviced) AND 'crossBorder' = ANY (regions_serviced) AND auth.status = 'Activated'`;
		}

		const result = await Db.selectFrom("users")
			.leftJoin("auth", "auth.id", "users.id")
			.selectAll()
			.where(query)
			.execute();

		const carrierProfiles = result.map((carrier) => {
			return {
				id: carrier.id,
				companyName: carrier.company_name,
				companyAddress: carrier.address,
				phoneNumber: carrier.phone_number,
				emergencyNumbers: carrier.emergency_numbers,
				languagesSupported: carrier.languages_supported,
				hasSmartphoneAccess: carrier.has_smartphone_access,
				hasLivetrackingAvailable: carrier.has_livetracking_available,
				hasDashcamSetup: carrier.has_dashcam_setup,
				areasServiced: carrier.areas_serviced,
				regionServiced: carrier.regions_serviced,
				avatarImageData: carrier.avatar_image_data,
				bucketStorageUrls: carrier.bucket_storage_urls,
			};
		});

		return carrierProfiles;
	} catch (err) {
		throw new Error(
			`users.service: getCarriersByRegion - Error gettings carriers ${err.message}`
		);
	}
};

export const getDriversByCarrierCompanyName = async ({
	carrierCompanyName,
	driverStatuses,
}: {
	carrierCompanyName: string;
	driverStatuses?: AuthStatus[];
}) => {
	try {
		const result = await Db.selectFrom("users")
			.innerJoin("auth", "auth.id", "users.id")
			.selectAll(["auth", "users"])
			.where("company_name", "=", carrierCompanyName)
			.where("auth.role", "=", "Driver")
			.$if(driverStatuses && driverStatuses.length > 0, (qb) => {
				return qb.where("auth.status", "in", ["Activated"]);
			})
			.execute();

		const drivers = result.map((driver) => {
			return {
				id: driver.id,
				username: driver.username,
				status: driver.status,
				firstName: driver.first_name,
				lastName: driver.last_name,
				createdAt: driver.created_at,
			};
		});

		return drivers;
	} catch (err) {
		throw new Error(
			`users.service: getDriversByCarrierCompanyName - Error gettings carriers ${err.message}`
		);
	}
};
