import { Generated, ColumnType } from "kysely";
import { CargoType, LocationType, WorkflowStatus } from "./types";

// TODO: go over this with mitty
export interface WorkflowTable {
	id: Generated<number>;
	user_for: number;
	status: WorkflowStatus;
	cargo_type: CargoType;
	pickup_location: string;
	pickup_location_type: LocationType;
	pickup_time: ColumnType<Date, string | undefined, never>;
	dropoff_location: string;
	dropoff_location_type: LocationType;
	dropoff_time: ColumnType<Date, string | undefined, never>;
	cargo_value: number;
	transit_time: string;
	routing: string;
	clearance: string;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
