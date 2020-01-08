"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const AttendanceServiceFactory_1 = require("../build/AttendanceServiceFactory");
class AttendanceProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("attendance", "Attendance microservice");
        this._factories.add(new AttendanceServiceFactory_1.AttendanceServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.AttendanceProcess = AttendanceProcess;
//# sourceMappingURL=AttendanceProcess.js.map