import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { AttendanceServiceFactory } from '../build/AttendanceServiceFactory';

export class AttendanceLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("attendance", "Attendance function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-attendance', 'controller', 'default', '*', '*'));
        this._factories.add(new AttendanceServiceFactory());
    }
}

export const handler = new AttendanceLambdaFunction().getHandler();