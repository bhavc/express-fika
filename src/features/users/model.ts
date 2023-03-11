import { Generated, ColumnType } from "kysely";
import { AreasServiced, RegionsServiced } from "./types";

export interface UserTable {
	id: Generated<number>;
	first_name?: string;
	last_name?: string | null;
	company_name?: string; // this should maybe be a table
	phone_number?: string;
	emergency_numbers: string[];
	gender: string;
	languages_supported: string[]; // this should maybe be a table
	has_smartphone_access?: boolean;
	has_livetracking_available?: boolean;
	has_dashcam_setup?: boolean;
	areas_serviced: AreasServiced[];
	region_serviced: RegionsServiced[];
	avatar_image_data: Record<string, any>;
	bucket_storage_urls: Record<string, any>[];
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
