"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class AttendanceMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('attendance');
        super.ensureIndex({ org_id: 1, start_time: -1, end_time: -1 });
    }
    convertToPublic(value) {
        if (value) {
            value = super.convertToPublic(value);
            value.objects = _.values(value.objects);
        }
        return value;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });
        let org_id = filter.getAsNullableString('org_id');
        if (org_id != null)
            criteria.push({ org_id: org_id });
        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ end_time: { $gt: fromTime } });
        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ start_time: { $lt: toTime } });
        let time = filter.getAsNullableDateTime('time');
        if (time != null) {
            criteria.push({ start_time: { $lte: time } });
            criteria.push({ end_time: { $gt: time } });
        }
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    addOne(correlationId, update, callback) {
        let filter = {
            org_id: update.org_id,
            start_time: update.start_date,
            end_time: update.end_date
        };
        let obj = {
            object_id: update.object_id,
            start_time: update.start_time,
            end_time: update.end_time
        };
        let setObj = {};
        setObj['objects.' + obj.object_id] = obj;
        let newItem = {
            $set: setObj,
            $setOnInsert: {
                id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                org_id: update.org_id,
                start_time: update.start_date,
                end_time: update.end_date,
            }
        };
        let options = {
            upsert: true
        };
        this._collection.findOneAndUpdate(filter, newItem, options, (err) => {
            if (!err)
                this._logger.trace(correlationId, "Added attendance for " + update.object_id + " at " + update.end_time);
            if (callback)
                callback(err);
        });
    }
    addBatch(correlationId, updates, callback) {
        if (updates == null || updates.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let options = {
            upsert: true
        };
        let batch = this._collection.initializeUnorderedBulkOp();
        let operations = [];
        for (let update of updates) {
            let obj = {
                object_id: update.object_id,
                start_time: update.start_time,
                end_time: update.end_time
            };
            let setObj = {};
            setObj['objects.' + obj.object_id] = obj;
            batch
                .find({
                org_id: update.org_id,
                start_time: update.start_date,
                end_time: update.end_date
            })
                .upsert()
                .updateOne({
                $set: setObj,
                $setOnInsert: {
                    id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                    org_id: update.org_id,
                    start_time: update.start_date,
                    end_time: update.end_date,
                }
            });
        }
        batch.execute((err) => {
            if (!err)
                this._logger.trace(correlationId, "Added " + updates.length + " attendances");
            if (callback)
                callback(null);
        });
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.AttendanceMongoDbPersistence = AttendanceMongoDbPersistence;
//# sourceMappingURL=AttendanceMongoDbPersistence.js.map