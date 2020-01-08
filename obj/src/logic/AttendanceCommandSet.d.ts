import { CommandSet } from 'pip-services3-commons-node';
import { IAttendanceController } from './IAttendanceController';
export declare class AttendanceCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IAttendanceController);
    private makeGetAttendancesCommand;
    private makeGetAttendancesWithinTimeCommand;
    private makeAddAttendanceCommand;
    private makeAddAttendancesCommand;
    private makeDeleteAttendancesCommand;
}
