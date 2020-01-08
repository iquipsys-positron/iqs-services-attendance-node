"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let moment = require('moment');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const AttendanceCommandSet_1 = require("./AttendanceCommandSet");
class AttendanceController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(AttendanceController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new AttendanceCommandSet_1.AttendanceCommandSet(this);
        return this._commandSet;
    }
    getAttendances(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    minTime(value1, value2) {
        return value1.getTime() < value2.getTime() ? value1 : value2;
    }
    maxTime(value1, value2) {
        return value1.getTime() > value2.getTime() ? value1 : value2;
    }
    getAttendancesWithinTime(correlationId, orgId, fromTime, toTime, callback) {
        let attendances = {
            org_id: orgId,
            start_time: fromTime,
            end_time: toTime,
            objects: []
        };
        let filter = pip_services3_commons_node_3.FilterParams.fromTuples('org_id', orgId, 'from_time', fromTime, 'to_time', toTime);
        this._persistence.getPageByFilter(correlationId, filter, null, (err, page) => {
            if (err) {
                callback(err, null);
                return;
            }
            // Combine results
            for (let attendance of page.data) {
                for (let obj of attendance.objects) {
                    // Skip out of range
                    if (obj.start_time.getTime() >= toTime.getTime())
                        continue;
                    if (obj.end_time.getTime() < fromTime.getTime())
                        continue;
                    // Cut by the interval
                    obj.start_time = this.maxTime(obj.start_time, fromTime);
                    obj.end_time = this.minTime(obj.end_time, toTime);
                    let obj2 = _.find(attendances.objects, o => o.object_id == obj.object_id);
                    if (obj2 != null) {
                        // Combine result
                        obj2.start_time = this.minTime(obj2.start_time, obj.start_time);
                        obj2.end_time = this.maxTime(obj2.end_time, obj.end_time);
                    }
                    else {
                        // Insert result
                        attendances.objects.push(obj);
                    }
                }
            }
            callback(null, attendances);
        });
    }
    fixAttendance(attendance) {
        attendance.start_time = pip_services3_commons_node_4.DateTimeConverter.toDateTime(attendance.start_time);
        attendance.end_time = pip_services3_commons_node_4.DateTimeConverter.toDateTime(attendance.end_time);
    }
    processAttendance(attendance) {
        this.fixAttendance(attendance);
        let result = [];
        let startDate = moment(attendance.start_time).utc().startOf('day');
        let endDate = moment(startDate).add(1, 'days');
        let startTime = attendance.start_time;
        let endTime = attendance.end_time;
        // Safety counter to prevent endless loops
        let count = 0;
        do {
            endTime = this.minTime(attendance.end_time, endDate.toDate());
            result.push({
                org_id: attendance.org_id,
                object_id: attendance.object_id,
                start_date: startDate.toDate(),
                end_date: endDate.toDate(),
                start_time: startTime,
                end_time: endTime
            });
            startTime = endDate.toDate();
            startDate = endDate;
            endDate = moment(startDate).add(1, 'days');
            count++;
        } while (attendance.end_time.getTime() > endTime.getTime() && count < 365);
        return result;
    }
    addAttendance(correlationId, attendance, callback) {
        let processedAttendances = this.processAttendance(attendance);
        if (processedAttendances.length == 1)
            this._persistence.addOne(correlationId, processedAttendances[0], callback);
        else
            this._persistence.addBatch(correlationId, processedAttendances, callback);
    }
    addAttendances(correlationId, attendances, callback) {
        let processedAttendances = [];
        for (let attendance of attendances) {
            let temp = this.processAttendance(attendance);
            processedAttendances.push(...temp);
        }
        if (processedAttendances.length == 1)
            this._persistence.addOne(correlationId, processedAttendances[0], callback);
        else
            this._persistence.addBatch(correlationId, processedAttendances, callback);
    }
    deleteAttendances(correlationId, filter, callback) {
        this._persistence.deleteByFilter(correlationId, filter, callback);
    }
}
exports.AttendanceController = AttendanceController;
AttendanceController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-attendance:persistence:*:*:1.0');
//# sourceMappingURL=AttendanceController.js.map