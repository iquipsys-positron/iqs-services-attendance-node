"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const AttendanceMongoDbPersistence_1 = require("../persistence/AttendanceMongoDbPersistence");
const AttendanceFilePersistence_1 = require("../persistence/AttendanceFilePersistence");
const AttendanceMemoryPersistence_1 = require("../persistence/AttendanceMemoryPersistence");
const AttendanceController_1 = require("../logic/AttendanceController");
const AttendanceHttpServiceV1_1 = require("../services/version1/AttendanceHttpServiceV1");
class AttendanceServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(AttendanceServiceFactory.MemoryPersistenceDescriptor, AttendanceMemoryPersistence_1.AttendanceMemoryPersistence);
        this.registerAsType(AttendanceServiceFactory.FilePersistenceDescriptor, AttendanceFilePersistence_1.AttendanceFilePersistence);
        this.registerAsType(AttendanceServiceFactory.MongoDbPersistenceDescriptor, AttendanceMongoDbPersistence_1.AttendanceMongoDbPersistence);
        this.registerAsType(AttendanceServiceFactory.ControllerDescriptor, AttendanceController_1.AttendanceController);
        this.registerAsType(AttendanceServiceFactory.HttpServiceDescriptor, AttendanceHttpServiceV1_1.AttendanceHttpServiceV1);
    }
}
exports.AttendanceServiceFactory = AttendanceServiceFactory;
AttendanceServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-attendance", "factory", "default", "default", "1.0");
AttendanceServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-attendance", "persistence", "memory", "*", "1.0");
AttendanceServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-attendance", "persistence", "file", "*", "1.0");
AttendanceServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-attendance", "persistence", "mongodb", "*", "1.0");
AttendanceServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-attendance", "controller", "default", "*", "1.0");
AttendanceServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-attendance", "service", "http", "*", "1.0");
//# sourceMappingURL=AttendanceServiceFactory.js.map