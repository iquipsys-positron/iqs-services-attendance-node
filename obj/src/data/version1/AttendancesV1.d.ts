import { IStringIdentifiable } from 'pip-services3-commons-node';
import { ObjectAttendanceV1 } from './ObjectAttendanceV1';
export declare class AttendancesV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    start_time: Date;
    end_time: Date;
    objects?: ObjectAttendanceV1[];
}
