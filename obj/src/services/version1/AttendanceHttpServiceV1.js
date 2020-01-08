"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class AttendanceHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/attendance');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-attendance', 'controller', 'default', '*', '1.0'));
    }
}
exports.AttendanceHttpServiceV1 = AttendanceHttpServiceV1;
//# sourceMappingURL=AttendanceHttpServiceV1.js.map