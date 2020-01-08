let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { AttendancesV1 } from '../../src/data/version1/AttendancesV1';
import { AttendanceV1 } from '../../src/data/version1/AttendanceV1';
import { AttendanceMemoryPersistence } from '../../src/persistence/AttendanceMemoryPersistence';
import { AttendanceController } from '../../src/logic/AttendanceController';
import { AttendanceLambdaFunction } from '../../src/container/AttendanceLambdaFunction';

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


suite('AttendanceLambdaFunction', ()=> {
    let lambda: AttendanceLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-attendance:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-attendance:controller:default:default:1.0'
        );

        lambda = new AttendanceLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        async.series([
        // Create one attendance
            (callback) => {
                lambda.act(
                    {
                        role: 'attendance',
                        cmd: 'add_attendance',
                        attendance: UPDATE1
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create other attendances
            (callback) => {
                lambda.act(
                    {
                        role: 'attendance',
                        cmd: 'add_attendances',
                        attendances: [ UPDATE2, UPDATE3 ]
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all attendance
            (callback) => {
                lambda.act(
                    {
                        role: 'attendance',
                        cmd: 'get_attendances' 
                    },
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
                lambda.act(
                    {
                        role: 'attendance',
                        cmd: 'delete_attendances'
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete attendance
            (callback) => {
                lambda.act(
                    {
                        role: 'attendance',
                        cmd: 'get_attendances'
                    },
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
});