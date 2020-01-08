let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { AttendancesV1 } from '../../src/data/version1/AttendancesV1';
import { AttendanceV1 } from '../../src/data/version1/AttendanceV1';

import { IAttendancePersistence } from '../../src/persistence/IAttendancePersistence';

let fromTime = new Date();

let UPDATE1: AttendanceV1 = {
    org_id: '1',
    object_id: '1',
    start_date: new Date(fromTime.getTime()),
    end_date: new Date(fromTime.getTime() + 8 * 3600000),
    start_time: new Date(fromTime.getTime()),
    end_time: new Date(fromTime.getTime() + 8 * 3600000)
};
let UPDATE2: AttendanceV1 = {
    org_id: '1',
    object_id: '2',
    start_date: new Date(fromTime.getTime()),
    end_date: new Date(fromTime.getTime() + 8 * 3600000),
    start_time: new Date(fromTime.getTime()),
    end_time: new Date(fromTime.getTime() + 8 * 3600000)
};

let toTime = new Date(fromTime.getTime() + 8 * 3600000);

let UPDATE3: AttendanceV1 = {
    org_id: '1',
    object_id: '1',
    start_date: new Date(fromTime.getTime() + 8 + 3600000),
    end_date: new Date(fromTime.getTime() + 16 * 3600000),
    start_time: new Date(fromTime.getTime() + 8 + 3600000),
    end_time: new Date(fromTime.getTime() + 16 * 3600000)
};

export class AttendancePersistenceFixture {
    private _persistence: IAttendancePersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testAddAttendances(done) {
        async.series([
        // Create one attendance
            (callback) => {
                this._persistence.addOne(
                    null,
                    UPDATE1,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create other attendances
            (callback) => {
                this._persistence.addBatch(
                    null,
                    [ UPDATE2, UPDATE3 ],
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let attendance1: AttendancesV1;

        async.series([
        // Create items
            (callback) => {
                this.testAddAttendances(callback);
            },
        // Get all attendance
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        attendance1 = page.data[0];

                        callback();
                    }
                );
            },
        // Delete attendance
            (callback) => {
                this._persistence.deleteByFilter(
                    null,
                    null,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete attendance
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 0);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create attendance
            (callback) => {
                this.testAddAttendances(callback);
            },
        // Get attendance filtered by org_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, attendance) => {
                        assert.isNull(err);

                        assert.isObject(attendance);
                        assert.lengthOf(attendance.data, 2);

                        callback();
                    }
                );
            },
        // Get attendance filtered by from/to time
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        from_time: fromTime,
                        to_time: toTime
                    }),
                    new PagingParams(),
                    (err, attendance) => {
                        assert.isNull(err);

                        assert.isObject(attendance);
                        assert.lengthOf(attendance.data, 2);

                        callback();
                    }
                );
            },
        // Get attendance filtered by time
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1',
                        time: fromTime
                    }),
                    new PagingParams(),
                    (err, attendance) => {
                        assert.isNull(err);

                        assert.isObject(attendance);
                        assert.lengthOf(attendance.data, 1);

                        callback();
                    }
                );
            }
        ], done);
    }

}
