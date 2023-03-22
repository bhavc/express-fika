import { Request, Response } from "express";
import {
	getUserProfile,
	editUserProfile,
	editUserProfileImage,
	getCarriersByRegion,
} from "./service";
import { getUserAuth } from "../auth/service";
import { generateSignedUrl, uploadFiles } from "../files/service";
import { getGeographicRegionByCountry } from "../groups/service";
import { FileType } from "../files/type";

export const GetCurrentUser = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(500).send("users.GetCurrentUser - no userId provided");
		}

		const userAuth = await getUserAuth({ userId });
		const userProfile = await getUserProfile({ userId });

		const userAvatarData = userProfile.avatarImageData;
		if (userAvatarData) {
			const signedFileUrl = await generateSignedUrl(
				userProfile.avatarImageData.blobName
			);

			userProfile.avatarImageData.url = signedFileUrl;
		}

		const userInsuranceFileData = userProfile.insuranceFileData as FileType[];
		if (userInsuranceFileData && userInsuranceFileData.length > 0) {
			for (const insuranceFile of userInsuranceFileData) {
				const signedFileUrl = await generateSignedUrl(insuranceFile.blobName);
				insuranceFile.url = signedFileUrl;
			}
		}

		const returnData = {
			data: {
				...userProfile,
				role: userAuth.role,
				status: userAuth.status,
			},
			message: "Success",
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

export const EditUserProfileImage = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res
				.status(500)
				.send("user.EditUserProfileImage - no userId provided");
		}

		const { files } = req;

		if (!files || files.length === 0) {
			return res.status(400).send("user.EditUserProfileImage - No files sent");
		}

		const fileList = files as Express.Multer.File[];
		const uploadFileData = await uploadFiles({ files: fileList });
		const blobData = uploadFileData[0];

		await editUserProfileImage({ userId, profileImageData: blobData });

		const returnData = {
			data: blobData,
			message: "Successfully updated User Profile Image",
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`user.EditUserProfileImage - Error getting workflow ${err.message}`
			);
	}
};

export const GetCarrierByRegion = async (req: Request, res: Response) => {
	try {
		if (!req.query || !req.query.pickupCountry || !req.query.dropoffCountry) {
			return res
				.status(500)
				.send(
					"user.GetCarrierByRegion - provide both pickup and dropoff countries"
				);
		}

		const pickupCountry = req.query.pickupCountry as string;
		const dropoffCountry = req.query.dropoffCountry as string;

		const geographicRegion = await getGeographicRegionByCountry({
			carrierCountry: pickupCountry,
		});

		const isWithinCountry = pickupCountry === dropoffCountry;

		const carrierProfiles = await getCarriersByRegion({
			geographicRegion,
			isWithinCountry,
		});

		const returnData = {
			data: carrierProfiles,
			message: "Success",
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`user.GetCarrierByRegion - Error getting carriers by geographic region ${err.message}`
			);
	}
};
