import { Generated, ColumnType } from "kysely";
import { AreasServiced, RegionsServiced } from "./types";

// TODO should add an icon?

export interface UserTable {
	id: Generated<number>;
	first_name?: string;
	last_name?: string | null;
	company_name?: string; // this should maybe be a table
	phone_number?: string;
	emergency_numbers: string[];
	gender: string;
	languages_supported: string[]; // this should maybe be a table
	smartphone_access?: boolean;
	livetracking_available?: boolean;
	dashcam_setup?: boolean;
	areas_serviced: AreasServiced;
	region_serviced: RegionsServiced;
	bucket_storage_urls: string[];
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
