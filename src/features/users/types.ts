// TODO This should be a dropdown with countries?
export type AreasServiced =
	| "Local"
	| "Provincial"
	| "Cross Country"
	| "Cross Border";

export type RegionsServiced = "North America" | "Africa";

export type CarrierProfileType = {
	company_name?: string;
	phone_number?: string;
	emergency_numbers?: string[];
	languages_supported?: string[];
	smartphone_access?: boolean;
	livetracking_available?: boolean;
	dashcam_setup?: boolean;
	areas_serviced?: AreasServiced[];
	region_serviced?: RegionsServiced[];
};
