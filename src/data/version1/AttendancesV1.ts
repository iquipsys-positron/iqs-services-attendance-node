import { IStringIdentifiable } from 'pip-services3-commons-node';

import { ObjectAttendanceV1 } from './ObjectAttendanceV1';

export class AttendancesV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;

    public start_time: Date;
    public end_time: Date;

    public objects?: ObjectAttendanceV1[];
}