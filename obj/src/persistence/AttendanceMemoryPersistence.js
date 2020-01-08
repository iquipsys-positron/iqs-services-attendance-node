"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class AttendanceMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let id = filter.getAsNullableString('id');
        let orgId = filter.getAsNullableString('org_id');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        let time = filter.getAsNullableDateTime('time');
        return (item) => {
            if (id && item.id != id)
                return false;
            if (orgId && item.org_id != orgId)
                return false;
            if (toTime && item.start_time.getTime() >= toTime.getTime())
                return false;
            if (fromTime && item.end_time.getTime() <= fromTime.getTime())
                return false;
            if (time && (item.start_time.getTime() > time.getTime() || item.end_time.getTime() <= time.getTime()))
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    addOne(correlationId, update, callback) {
        let item = this._items.find((x) => {
            return x.org_id == update.org_id
                && x.start_time.getTime() == update.start_date.getTime()
                && x.end_time.getTime() == update.end_date.getTime();
        });
        if (item == null) {
            item = {
                id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                org_id: update.org_id,
                start_time: update.start_date,
                end_time: update.end_date,
                objects: []
            };
            this._items.push(item);
        }
        item.objects = _.filter(item.objects, o => o.object_id != update.object_id);
        let obj = {
            object_id: update.object_id,
            start_time: update.start_time,
            end_time: update.end_time
        };
        item.objects.push(obj);
        this._logger.trace(correlationId, "Added attendance for " + update.object_id + " at " + update.end_time);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
    addBatch(correlationId, updates, callback) {
        async.each(updates, (u, callback) => {
            this.addOne(correlationId, u, callback);
        }, callback);
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.AttendanceMemoryPersistence = AttendanceMemoryPersistence;
//# sourceMappingURL=AttendanceMemoryPersistence.js.map