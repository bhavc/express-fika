import { FileType } from "../files/type";

export type AreasServiced = "local" | "crossProvince" | "crossBorder";

export type RegionsServiced = "northAmerica" | "africa";

export type UserProfile = {
	id: number;
	firstName?: string;
	lastName?: string;
	companyName?: string; // this should maybe be a table
	companyAddress?: string;
	phoneNumber?: string;
	emergencyNumbers?: string[];
	gender?: string;
	languagesSupported?: string[]; // this should maybe be a table
	hasSmartphoneAccess?: boolean;
	hasLivetrackingAvailable?: boolean;
	hasDashcamSetup?: boolean;
	areasServiced?: AreasServiced[];
	regionServiced?: RegionsServiced[];
	avatarImageData?: { [key: string]: any };
	insuranceFileData?: { [key: string]: any }[];
	bucketStorageUrls?: { [key: string]: any };
	created_at?: string;
	modified_at?: string;
};

export type CarrierProfileType = {
	clientCompanyName?: string;
	clientCompanyAddress?: string;
	clientCompanyPhone?: string;
	clientCompanyEmergencyPhone?: string[];
	carrierInsuranceFiles: FileType[];
	clientRegionsServiced?: RegionsServiced[];
	clientAreasServiced?: AreasServiced[];
	clientLanguagesSupported?: string;
	clientHasSmartphoneAccess?: boolean;
	clientHasLiveTracking?: boolean;
	clientHasDashcam?: boolean;
};

export type DriverType = {
	driverCompanyName?: string;
};
