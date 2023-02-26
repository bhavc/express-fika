import { Storage } from "@google-cloud/storage";

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;

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

const generatePublicUrl = (blobName: string) => {
	return `https://storage.cloud.google.com/${bucketName}/${encodeURIComponent(
		blobName
	)}`;
};

// Puts file into bucket
export const uploadFiles = async ({
	files,
}: {
	files: Express.Multer.File[];
}) => {
	try {
		const fileUrls: string[] = [];

		files.map(async (file) => {
			const blobName = generateFileHash(file.originalname);
			console.log("blobName", blobName);
			const filePublicUrl = generatePublicUrl(blobName);
			fileUrls.push(filePublicUrl);
			await uploadFileToCloudStorage(blobName, file);
		});

		// assuming this is going to work
		console.log("file urls", fileUrls);
		return fileUrls;
	} catch (err) {
		throw new Error(
			`files.service: uploadFiles - Error storing file ${err.message}`
		);
	}
};
