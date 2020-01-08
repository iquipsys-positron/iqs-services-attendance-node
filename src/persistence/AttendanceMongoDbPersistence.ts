let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { AttendancesV1 } from '../data/version1/AttendancesV1';
import { ObjectAttendanceV1 } from '../data/version1/ObjectAttendanceV1';
import { AttendanceV1 } from '../data/version1/AttendanceV1';
import { IAttendancePersistence } from './IAttendancePersistence';

export class AttendanceMongoDbPersistence
    extends IdentifiableMongoDbPersistence<AttendancesV1, string>
    implements IAttendancePersistence {

    constructor() {
        super('attendance');
        super.ensureIndex({ org_id: 1, start_time: -1, end_time: -1 });
    }
    
    protected convertToPublic(value: any): any {
        if (value) {
            value = super.convertToPublic(value);
            value.objects = _.values(value.objects);
        }
        return value;
    }    

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let org_id = filter.getAsNullableString('org_id');
        if (org_id != null)
            criteria.push({ org_id: org_id });

        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ end_time: { $gt: fromTime } });

        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ start_time: { $lt: toTime } });

        let time = filter.getAsNullableDateTime('time');
        if (time != null) {
            criteria.push({ start_time: { $lte: time } });
            criteria.push({ end_time: { $gt: time } });
        }

        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<AttendancesV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public addOne(correlationId: string, update: AttendanceV1,
        callback: (err: any) => void): void {

        let filter = {
            org_id: update.org_id,
            start_time: update.start_date,
            end_time: update.end_date
        };

        let obj = <ObjectAttendanceV1>{
            object_id: update.object_id,
            start_time: update.start_time,
            end_time: update.end_time
        };
        let setObj = {};
        setObj['objects.' + obj.object_id] = obj;

        let newItem = {
            $set: setObj,
            $setOnInsert: {
                id: IdGenerator.nextLong(),
                org_id: update.org_id,
                start_time: update.start_date,
                end_time: update.end_date,
            }
        };

        let options = {
            upsert: true
        };
        
        this._collection.findOneAndUpdate(filter, newItem, options, (err) => {
            if (!err)
                this._logger.trace(correlationId, "Added attendance for " +  update.object_id + " at " + update.end_time);
           
            if (callback) callback(err);
        });
    }

    public addBatch(correlationId: string, updates: AttendanceV1[],
        callback: (err: any) => void): void {

        if (updates == null || updates.length == 0) {
            if (callback) callback(null);
            return;
        }

        let options = {
            upsert: true
        };

        let batch = this._collection.initializeUnorderedBulkOp();

        let operations: any[] = [];

        for (let update of updates) {
            let obj = <ObjectAttendanceV1>{ 
                object_id: update.object_id,
                start_time: update.start_time,
                end_time: update.end_time
            };
            let setObj = {};
            setObj['objects.' + obj.object_id] = obj;
    
            batch
                .find({
                    org_id: update.org_id,
                    start_time: update.start_date,
                    end_time: update.end_date
                })
                .upsert()
                .updateOne({
                    $set: setObj,
                    $setOnInsert: {
                        id: IdGenerator.nextLong(),
                        org_id: update.org_id,
                        start_time: update.start_date,
                        end_time: update.end_date,
                    }
                });
        }

        batch.execute((err) => {
            if (!err)
                this._logger.trace(correlationId, "Added " + updates.length + " attendances");
            
            if (callback) callback(null);
        });
    }
    
    public deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}
