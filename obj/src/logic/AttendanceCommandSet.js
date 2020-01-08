"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const pip_services3_commons_node_9 = require("pip-services3-commons-node");
const AttendanceV1Schema_1 = require("../data/version1/AttendanceV1Schema");
class AttendanceCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetAttendancesCommand());
        this.addCommand(this.makeGetAttendancesWithinTimeCommand());
        this.addCommand(this.makeAddAttendanceCommand());
        this.addCommand(this.makeAddAttendancesCommand());
        this.addCommand(this.makeDeleteAttendancesCommand());
    }
    makeGetAttendancesCommand() {
        return new pip_services3_commons_node_2.Command("get_attendances", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_8.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_9.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getAttendances(correlationId, filter, paging, callback);
        });
    }
    makeGetAttendancesWithinTimeCommand() {
        return new pip_services3_commons_node_2.Command("get_attendances_within_time", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('org_id', pip_services3_commons_node_7.TypeCode.String)
            .withRequiredProperty('from_time', null) // TypeCode.DateTime
            .withRequiredProperty('to_time', null), // TypeCode.DateTime
        (correlationId, args, callback) => {
            let orgId = args.getAsNullableString('org_id');
            let fromTime = args.getAsDateTime('from_time');
            let toTime = args.getAsDateTime('to_time');
            this._logic.getAttendancesWithinTime(correlationId, orgId, fromTime, toTime, callback);
        });
    }
    makeAddAttendanceCommand() {
        return new pip_services3_commons_node_2.Command("add_attendance", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('attendance', new AttendanceV1Schema_1.AttendanceV1Schema()), (correlationId, args, callback) => {
            let attendance = args.get("attendance");
            this._logic.addAttendance(correlationId, attendance, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
    makeAddAttendancesCommand() {
        return new pip_services3_commons_node_2.Command("add_attendances", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('attendances', new pip_services3_commons_node_6.ArraySchema(new AttendanceV1Schema_1.AttendanceV1Schema())), (correlationId, args, callback) => {
            let attendances = args.get("attendances");
            this._logic.addAttendances(correlationId, attendances, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
    makeDeleteAttendancesCommand() {
        return new pip_services3_commons_node_2.Command("delete_attendances", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_8.FilterParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            this._logic.deleteAttendances(correlationId, filter, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
}
exports.AttendanceCommandSet = AttendanceCommandSet;
//# sourceMappingURL=AttendanceCommandSet.js.map