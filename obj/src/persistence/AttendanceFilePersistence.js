"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_data_node_1 = require("pip-services3-data-node");
const AttendanceMemoryPersistence_1 = require("./AttendanceMemoryPersistence");
class AttendanceFilePersistence extends AttendanceMemoryPersistence_1.AttendanceMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_node_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.AttendanceFilePersistence = AttendanceFilePersistence;
//# sourceMappingURL=AttendanceFilePersistence.js.map