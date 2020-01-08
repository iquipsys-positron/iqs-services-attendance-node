"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class ObjectAttendanceV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('object_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('start_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('end_time', pip_services3_commons_node_2.TypeCode.DateTime);
    }
}
exports.ObjectAttendanceV1Schema = ObjectAttendanceV1Schema;
//# sourceMappingURL=ObjectAttendanceV1Schema.js.map