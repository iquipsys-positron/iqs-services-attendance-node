import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { AttendancesV1 } from '../data/version1/AttendancesV1';
import { AttendanceV1 } from '../data/version1/AttendanceV1';
export interface IAttendanceController {
    getAttendances(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<AttendancesV1>) => void): void;
    getAttendancesWithinTime(correlationId: string, orgId: string, fromTime: Date, toTime: Date, callback: (err: any, attendances: AttendancesV1) => void): void;
    addAttendance(correlationId: string, attendance: AttendanceV1, callback: (err: any) => void): void;
    addAttendances(correlationId: string, attendances: AttendanceV1[], callback: (err: any) => void): void;
    deleteAttendances(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
