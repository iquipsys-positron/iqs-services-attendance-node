let _ = require('lodash');
let async = require('async');
let moment = require('moment');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';

import { AttendancesV1 } from '../data/version1/AttendancesV1';
import { AttendanceV1 } from '../data/version1/AttendanceV1';
import { IAttendancePersistence } from '../persistence/IAttendancePersistence';
import { IAttendanceController } from './IAttendanceController';
import { AttendanceCommandSet } from './AttendanceCommandSet';

export class AttendanceController implements  IConfigurable, IReferenceable, ICommandable, IAttendanceController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-attendance:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(AttendanceController._defaultConfig);
    private _persistence: IAttendancePersistence;
    private _commandSet: AttendanceCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IAttendancePersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new AttendanceCommandSet(this);
        return this._commandSet;
    }
    
    public getAttendances(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<AttendancesV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    private minTime(value1: Date, value2: Date) {
        return value1.getTime() < value2.getTime() ? value1 : value2;
    }

    private maxTime(value1: Date, value2: Date) {
        return value1.getTime() > value2.getTime() ? value1 : value2;
    }
    
    public getAttendancesWithinTime(correlationId: string, orgId: string, fromTime: Date, toTime: Date, 
        callback: (err: any, attendances: AttendancesV1) => void): void {
        
        let attendances = <AttendancesV1> {
            org_id: orgId,
            start_time: fromTime,
            end_time: toTime,
            objects: []
        };

        let filter = FilterParams.fromTuples(
            'org_id', orgId,
            'from_time', fromTime,
            'to_time', toTime
        );

        this._persistence.getPageByFilter(correlationId, filter, null, (err, page) => {
            if (err) {
                callback(err, null);
                return;
            }

            // Combine results
            for (let attendance of page.data) {
                for (let obj of attendance.objects) {
                    // Skip out of range
                    if (obj.start_time.getTime() >= toTime.getTime())
                        continue;
                    if (obj.end_time.getTime() < fromTime.getTime())
                        continue;

                    // Cut by the interval
                    obj.start_time = this.maxTime(obj.start_time, fromTime);
                    obj.end_time = this.minTime(obj.end_time, toTime);

                    let obj2 = _.find(attendances.objects, o => o.object_id == obj.object_id);
                    if (obj2 != null) {
                        // Combine result
                        obj2.start_time = this.minTime(obj2.start_time, obj.start_time);
                        obj2.end_time = this.maxTime(obj2.end_time, obj.end_time);
                    } else {
                        // Insert result
                        attendances.objects.push(obj);
                    }
                }
            }

            callback(null, attendances);
        });
    }
    
    private fixAttendance(attendance: AttendanceV1): void {
        attendance.start_time = DateTimeConverter.toDateTime(attendance.start_time);
        attendance.end_time = DateTimeConverter.toDateTime(attendance.end_time);
    }

    private processAttendance(attendance: AttendanceV1): AttendanceV1[] {
        this.fixAttendance(attendance);

        let result: AttendanceV1[] = [];
        let startDate = moment(attendance.start_time).utc().startOf('day');
        let endDate = moment(startDate).add(1, 'days');
        let startTime = attendance.start_time;
        let endTime = attendance.end_time;

        // Safety counter to prevent endless loops
        let count = 0;

        do {
            endTime = this.minTime(attendance.end_time, endDate.toDate());

            result.push({
                org_id: attendance.org_id,
                object_id: attendance.object_id,
                start_date: startDate.toDate(),
                end_date: endDate.toDate(),
                start_time: startTime,
                end_time: endTime
            });

            startTime = endDate.toDate();
            startDate = endDate;
            endDate = moment(startDate).add(1, 'days');
            count++;
        } while (attendance.end_time.getTime() > endTime.getTime() && count < 365);

        return result;
    }
    
    public addAttendance(correlationId: string, attendance: AttendanceV1, 
        callback: (err: any) => void): void {

        let processedAttendances = this.processAttendance(attendance);

        if (processedAttendances.length == 1)
            this._persistence.addOne(correlationId, processedAttendances[0], callback);
        else
            this._persistence.addBatch(correlationId, processedAttendances, callback);
    }

    public addAttendances(correlationId: string, attendances: AttendanceV1[], 
        callback: (err: any) => void): void {
        
        let processedAttendances: AttendanceV1[] = [];

        for (let attendance of attendances) {
            let temp = this.processAttendance(attendance);
            processedAttendances.push(...temp);
        }
 
        if (processedAttendances.length == 1)
            this._persistence.addOne(correlationId, processedAttendances[0], callback);
        else
            this._persistence.addBatch(correlationId, processedAttendances, callback);
    }

    public deleteAttendances(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {  
        this._persistence.deleteByFilter(correlationId, filter, callback);
    }

}
