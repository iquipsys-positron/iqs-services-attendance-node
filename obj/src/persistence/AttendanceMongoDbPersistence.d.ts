import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { AttendancesV1 } from '../data/version1/AttendancesV1';
import { AttendanceV1 } from '../data/version1/AttendanceV1';
import { IAttendancePersistence } from './IAttendancePersistence';
export declare class AttendanceMongoDbPersistence extends IdentifiableMongoDbPersistence<AttendancesV1, string> implements IAttendancePersistence {
    constructor();
    protected convertToPublic(value: any): any;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<AttendancesV1>) => void): void;
    addOne(correlationId: string, update: AttendanceV1, callback: (err: any) => void): void;
    addBatch(correlationId: string, updates: AttendanceV1[], callback: (err: any) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
