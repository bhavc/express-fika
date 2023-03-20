import { Generated, ColumnType } from "kysely";

export interface PaymentTable {
	id: Generated<number>;
	workflow_id: number;
	price: number;
	bid_turn: number;
	accepted_by_carrier: boolean;
	accepted_by_shipper: boolean;
	accepted_date: ColumnType<Date, string | undefined, never>;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
