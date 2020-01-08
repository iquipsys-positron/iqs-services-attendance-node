import { ConfigParams } from 'pip-services3-commons-node';

import { AttendanceFilePersistence } from '../../src/persistence/AttendanceFilePersistence';
import { AttendancePersistenceFixture } from './AttendancePersistenceFixture';

suite('AttendanceFilePersistence', ()=> {
    let persistence: AttendanceFilePersistence;
    let fixture: AttendancePersistenceFixture;
    
    setup((done) => {
        persistence = new AttendanceFilePersistence('./data/attendance.test.json');

        fixture = new AttendancePersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});