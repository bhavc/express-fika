// TODO This should be a dropdown with countries?
export type AreasServiced =
	| "Local"
	| "Provincial"
	| "Cross Country"
	| "Cross Border";

export type RegionsServiced = "North America" | "Africa";

export type CarrierProfileType = {
	clientCompanyName?: string;
	clientCompanyAddress?: string;
	clientCompanyPhone?: string;
	clientCompanyEmergencyPhone?: string[];
	clientRegionsServiced?: RegionsServiced[];
	clientAreasServiced?: AreasServiced[];
	clientLanguagesSupported?: string;
	clientHasSmartphoneAccess?: boolean;
	clientHasLiveTracking?: boolean;
	clientHasDashcam?: boolean;
};
