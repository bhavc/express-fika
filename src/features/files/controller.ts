import { Request, Response } from "express";

import { uploadFiles } from "./service";

export const UploadFile = async (req: Request, res: Response) => {
	try {
		const { files } = req;

		if (!files || files.length === 0) {
			return res.status(400).send("files.UploadFile - No files sent");
		}

		// we want to upload the files to cloud storage here and return the urls

		const fileList = files as Express.Multer.File[];

		const uploadFileData = await uploadFiles({ files: fileList });

		const returnData = {
			uploadFileData,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(`files.UploadFile - Error getting workflow ${err.message}`);
	}
};
