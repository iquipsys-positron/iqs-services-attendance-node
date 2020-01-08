import { ConfigParams } from 'pip-services3-commons-node';

import { AttendanceMemoryPersistence } from '../../src/persistence/AttendanceMemoryPersistence';
import { AttendancePersistenceFixture } from './AttendancePersistenceFixture';

suite('AttendanceMemoryPersistence', ()=> {
    let persistence: AttendanceMemoryPersistence;
    let fixture: AttendancePersistenceFixture;
    
    setup((done) => {
        persistence = new AttendanceMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new AttendancePersistenceFixture(persistence);
        
        persistence.open(null, done);
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