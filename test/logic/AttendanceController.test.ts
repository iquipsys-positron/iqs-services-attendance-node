let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { AttendancesV1 } from '../../src/data/version1/AttendancesV1';
import { AttendanceV1 } from '../../src/data/version1/AttendanceV1';
import { AttendanceMemoryPersistence } from '../../src/persistence/AttendanceMemoryPersistence';
import { AttendanceController } from '../../src/logic/AttendanceController';

let UPDATE1: AttendanceV1 = {
    org_id: '1',
    object_id: '1',
    start_time: new Date(2017,10,18,9,0,0),
    end_time: new Date(2017,10,18,17,0,0)
};
let UPDATE2: AttendanceV1 = {
    org_id: '1',
    object_id: '2',
    start_time: new Date(2017,10,18,10,30,0),
    end_time: new Date(2017,10,18,16,45,0)
};
let UPDATE3: AttendanceV1 = {
    org_id: '1',
    object_id: '1',
    start_time: new Date(2017,10,20,9,0,0),
    end_time: new Date(2017,10,20,17,0,0)
};

suite('AttendanceController', ()=> {    
    let persistence: AttendanceMemoryPersistence;
    let controller: AttendanceController;

    suiteSetup(() => {
        persistence = new AttendanceMemoryPersistence();
        controller = new AttendanceController();

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-attendance', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-attendance', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });
    
    
    test('CRUD Operations', (done) => {
        async.series([
        // Create one attendance
            (callback) => {
                controller.addAttendance(
                    null, UPDATE1,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create other attendances
            (callback) => {
                controller.addAttendances(
                    null, [ UPDATE2, UPDATE3 ],
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all attendances
            (callback) => {
                controller.getAttendances(
                    null, null, null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Delete attendance
            (callback) => {
                controller.deleteAttendances(
                    null, null,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get deleted attendances
            (callback) => {
                controller.getAttendances(
                    null, null, null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 0);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Get Attendances within Time', (done) => {
        async.series([
        // Create one attendance
            (callback) => {
                controller.addAttendances(
                    null, [ UPDATE1, UPDATE2, UPDATE3 ],
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get attendances within Timeline
            (callback) => {
                controller.getAttendancesWithinTime(
                    null, '1', new Date(2017,10,17,0,0,0), new Date(2017,10,21,0,0,0),
                    (err, attendances) => {
                        assert.isNull(err);

                        assert.isObject(attendances);
                        assert.equal(attendances.org_id, '1');
                        assert.lengthOf(attendances.objects, 2);

                        let obj1 = _.find(attendances.objects, o => o.object_id == '1');
                        assert.equal(obj1.start_time.getTime(), new Date(2017,10,18,9,0,0).getTime());
                        assert.equal(obj1.end_time.getTime(), new Date(2017,10,20,17,0,0).getTime());
                        
                        callback();
                    }
                );
            }
        ], done);
    });

    test('Split Attendances', (done) => {
        async.series([
        // Create one attendance
            (callback) => {
                controller.addAttendance(
                    null,
                    {
                        org_id: '1',
                        object_id: '1',
                        start_time: new Date(Date.UTC(2017, 1, 1)),
                        end_time: new Date(Date.UTC(2017, 1, 4)),
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Check attendances
            (callback) => {
                controller.getAttendances(
                    null, null, null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                );
            }
        ], done);
    });    
});