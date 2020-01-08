import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class AttendanceHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/attendance');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-attendance', 'controller', 'default', '*', '1.0'));
    }
}