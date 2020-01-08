import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { AttendanceServiceFactory } from '../build/AttendanceServiceFactory';

export class AttendanceProcess extends ProcessContainer {

    public constructor() {
        super("attendance", "Attendance microservice");
        this._factories.add(new AttendanceServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
