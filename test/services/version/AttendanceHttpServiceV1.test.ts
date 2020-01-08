let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { AttendancesV1 } from '../../../src/data/version1/AttendancesV1';
import { AttendanceV1 } from '../../../src/data/version1/AttendanceV1';
import { AttendanceMemoryPersistence } from '../../../src/persistence/AttendanceMemoryPersistence';
import { AttendanceController } from '../../../src/logic/AttendanceController';
import { AttendanceHttpServiceV1 } from '../../../src/services/version1/AttendanceHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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

suite('AttendanceHttpServiceV1', ()=> {    
    let persistence: AttendanceMemoryPersistence;
    let service: AttendanceHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        persistence = new AttendanceMemoryPersistence();
        let controller = new AttendanceController();

        service = new AttendanceHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-attendance', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-attendance', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-attendance', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup((done) => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });

        persistence.clear(null, done);
    });
        
    test('CRUD Operations', (done) => {
        async.series([
        // Create one attendance
            (callback) => {
                rest.post('/v1/attendance/add_attendance',
                    {
                        attendance: UPDATE1
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create another attendance
            (callback) => {
                rest.post('/v1/attendance/add_attendances', 
                    {
                        attendances: [ UPDATE2, UPDATE3 ]
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all attendance
            (callback) => {
                rest.post('/v1/attendance/get_attendances',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Delete attendance
            (callback) => {
                rest.post('/v1/attendance/delete_attendances',
                    { },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete attendance
            (callback) => {
                rest.post('/v1/attendance/get_attendances',
                    { },
                    (err, req, res, page) => {
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
                rest.post('/v1/attendance/add_attendances', 
                    {
                        attendances: [ UPDATE1, UPDATE2, UPDATE3 ]
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get attendances within Timeline
            (callback) => {
                rest.post('/v1/attendance/get_attendances_within_time',
                    {
                        org_id: '1',
                        from_time: new Date(2017,10,17,0,0,0),
                        to_time: new Date(2017,10,21,0,0,0)
                    },
                    (err, req, res, attendances) => {
                        assert.isNull(err);

                        assert.isObject(attendances);
                        assert.equal(attendances.org_id, '1');
                        assert.lengthOf(attendances.objects, 2);

                        let obj1 = _.find(attendances.objects, o => o.object_id == '1');
                        // assert.equal(obj1.start_time.getTime(), new Date(2017,10,18,9,0,0).getTime());
                        // assert.equal(obj1.end_time.getTime(), new Date(2017,10,20,17,0,0).getTime());
                        
                        callback();
                    }
                );
            }
        ], done);
    });    
});