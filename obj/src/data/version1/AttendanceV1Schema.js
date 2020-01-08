"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class AttendanceV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('org_id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('object_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('start_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('end_time', pip_services3_commons_node_2.TypeCode.DateTime);
    }
}
exports.AttendanceV1Schema = AttendanceV1Schema;
//# sourceMappingURL=AttendanceV1Schema.js.map