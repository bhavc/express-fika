import { Storage } from "@google-cloud/storage";
import googleCloudCredentials from "../../../GoogleCloudProjectKey.json";

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

const generateFileHash = (originalFileName: string) => {
	const unixTimeStampMS = Date.now();
	const unixTimeStampSeconds = Math.floor(unixTimeStampMS / 1000);
	const formattedName = `${unixTimeStampSeconds} - ${originalFileName}`;
	return formattedName;
};

const uploadFileToCloudStorage = async (
	blobName: string,
	file: Express.Multer.File
) => {
	try {
		const storage = new Storage();

		return await storage.bucket(bucketName).file(blobName).save(file.buffer);
	} catch (err) {
		throw new Error(
			`files.service: uploadFileToCloudStorage - Error uploading file ${err.message}`
		);
	}
};

const generateSignedUrl = async (fileName: string) => {
	try {
		const storage = new Storage({
			projectId,
			credentials: googleCloudCredentials,
		});
		// Get a v4 signed URL for reading the file
		const [signedUrl] = await storage
			.bucket(bucketName)
			.file(fileName)
			.getSignedUrl({
				version: "v4",
				action: "read",
				expires: Date.now() + 15 * 60 * 1000, // 15 mins
			});

		return await signedUrl;
	} catch (err) {
		throw new Error(
			`files.service: generateSignedUrl - Error storing file ${err.message}`
		);
	}
};

// TODO add auth to this route
// validate file types here
export const uploadFiles = async ({
	files,
}: {
	files: Express.Multer.File[];
}) => {
	try {
		const fileData = await Promise.all(
			files.map(async (file) => {
				const blobName = generateFileHash(file.originalname);
				await uploadFileToCloudStorage(blobName, file);
				const signedUrl = await generateSignedUrl(blobName);

				return {
					url: signedUrl,
					name: file.originalname,
					type: file.mimetype,
				};
			})
		);

		return fileData;
	} catch (err) {
		throw new Error(
			`files.service: uploadFiles - Error storing file ${err.message}`
		);
	}
};
