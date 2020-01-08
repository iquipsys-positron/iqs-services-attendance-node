"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const AttendanceServiceFactory_1 = require("../build/AttendanceServiceFactory");
class AttendanceLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("attendance", "Attendance function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-attendance', 'controller', 'default', '*', '*'));
        this._factories.add(new AttendanceServiceFactory_1.AttendanceServiceFactory());
    }
}
exports.AttendanceLambdaFunction = AttendanceLambdaFunction;
exports.handler = new AttendanceLambdaFunction().getHandler();
//# sourceMappingURL=AttendanceLambdaFunction.js.map