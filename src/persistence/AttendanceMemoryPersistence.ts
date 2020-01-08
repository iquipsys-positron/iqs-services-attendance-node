let _ = require('lodash');
let async = require('async');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { AttendancesV1 } from '../data/version1/AttendancesV1';
import { ObjectAttendanceV1 } from '../data/version1/ObjectAttendanceV1';
import { AttendanceV1 } from '../data/version1/AttendanceV1';
import { IAttendancePersistence } from './IAttendancePersistence';

export class AttendanceMemoryPersistence 
    extends IdentifiableMemoryPersistence<AttendancesV1, string> 
    implements IAttendancePersistence {

    constructor() {
        super();
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let id = filter.getAsNullableString('id');
        let orgId = filter.getAsNullableString('org_id');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        let time = filter.getAsNullableDateTime('time');
                
        return (item) => {
            if (id && item.id != id) 
                return false;
            if (orgId && item.org_id != orgId) 
                return false;
            if (toTime && item.start_time.getTime() >= toTime.getTime()) 
                return false;
            if (fromTime && item.end_time.getTime() <= fromTime.getTime()) 
                return false;
            if (time && (item.start_time.getTime() > time.getTime() || item.end_time.getTime() <= time.getTime())) 
                return false;
            return true; 
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<AttendancesV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public addOne(correlationId: string, update: AttendanceV1,
        callback: (err: any) => void): void {

        let item = this._items.find((x) => { 
            return x.org_id == update.org_id 
                && x.start_time.getTime() == update.start_date.getTime()
                && x.end_time.getTime() == update.end_date.getTime(); 
        });

        if (item == null) {
            item = <AttendancesV1> {
                id: IdGenerator.nextLong(),
                org_id: update.org_id,
                start_time: update.start_date,
                end_time: update.end_date,
                objects: []
            };
            this._items.push(item);
        }

        item.objects = _.filter(item.objects, o => o.object_id != update.object_id);
        let obj = <ObjectAttendanceV1>{
            object_id: update.object_id,
            start_time: update.start_time,
            end_time: update.end_time
        };
        item.objects.push(obj);

        this._logger.trace(correlationId, "Added attendance for " +  update.object_id + " at " + update.end_time);

        this.save(correlationId, (err) => {
            if (callback) callback(err);
        });
    }

    public addBatch(correlationId: string, updates: AttendanceV1[],
        callback: (err: any) => void): void {

        async.each(updates, (u, callback) => {
            this.addOne(correlationId, u, callback);
        }, callback);
    }
    
    public deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
    
}
