import { Request, Response } from "express";

export const UploadFile = async (req: Request, res: Response) => {
	try {
		console.log("req", req.userId);
		console.log("files", req.files);

		const { files } = req;

		if (!files || files.length === 0) {
			return res.status(400).send("files.UploadFile - No files sent");
		}

		// we want to upload the files to cloud storage here and return the urls

		return res.status(200).json({ message: "great" });
	} catch (err) {
		return res
			.status(500)
			.send(`files.UploadFile - Error getting workflow ${err.message}`);
	}
};
