import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { AttendanceMemoryPersistence } from './AttendanceMemoryPersistence';
import { AttendancesV1 } from '../data/version1/AttendancesV1';
export declare class AttendanceFilePersistence extends AttendanceMemoryPersistence {
    protected _persister: JsonFilePersister<AttendancesV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
