import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { AttendancesV1 } from '../data/version1/AttendancesV1';
import { AttendancesV1Schema } from '../data/version1/AttendancesV1Schema';
import { AttendanceV1Schema } from '../data/version1/AttendanceV1Schema';
import { IAttendanceController } from './IAttendanceController';

export class AttendanceCommandSet extends CommandSet {
    private _logic: IAttendanceController;

    constructor(logic: IAttendanceController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetAttendancesCommand());
		this.addCommand(this.makeGetAttendancesWithinTimeCommand());
		this.addCommand(this.makeAddAttendanceCommand());
		this.addCommand(this.makeAddAttendancesCommand());
		this.addCommand(this.makeDeleteAttendancesCommand());
    }

	private makeGetAttendancesCommand(): ICommand {
		return new Command(
			"get_attendances",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getAttendances(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetAttendancesWithinTimeCommand(): ICommand {
		return new Command(
			"get_attendances_within_time",
			new ObjectSchema(true)
				.withRequiredProperty('org_id', TypeCode.String)
				.withRequiredProperty('from_time', null) // TypeCode.DateTime
				.withRequiredProperty('to_time', null), // TypeCode.DateTime
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let orgId = args.getAsNullableString('org_id');
				let fromTime = args.getAsDateTime('from_time');
				let toTime = args.getAsDateTime('to_time');
                this._logic.getAttendancesWithinTime(correlationId, orgId, fromTime, toTime, callback);
            }
		);
	}
	
	private makeAddAttendanceCommand(): ICommand {
		return new Command(
			"add_attendance",
			new ObjectSchema(true)
				.withRequiredProperty('attendance', new AttendanceV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let attendance = args.get("attendance");
                this._logic.addAttendance(correlationId, attendance, (err) => {
					if (callback) callback(err, null);
				});
            }
		);
	}

	private makeAddAttendancesCommand(): ICommand {
		return new Command(
			"add_attendances",
			new ObjectSchema(true)
				.withRequiredProperty('attendances', new ArraySchema(new AttendanceV1Schema())),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let attendances = args.get("attendances");
                this._logic.addAttendances(correlationId, attendances, (err) => {
					if (callback) callback(err, null);
				});
            }
		);
	}
	
	private makeDeleteAttendancesCommand(): ICommand {
		return new Command(
			"delete_attendances",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                this._logic.deleteAttendances(correlationId, filter, (err) => {
					if (callback) callback(err, null);
				});
			}
		);
	}

}