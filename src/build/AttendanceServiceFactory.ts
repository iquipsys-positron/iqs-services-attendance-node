import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { AttendanceMongoDbPersistence } from '../persistence/AttendanceMongoDbPersistence';
import { AttendanceFilePersistence } from '../persistence/AttendanceFilePersistence';
import { AttendanceMemoryPersistence } from '../persistence/AttendanceMemoryPersistence';
import { AttendanceController } from '../logic/AttendanceController';
import { AttendanceHttpServiceV1 } from '../services/version1/AttendanceHttpServiceV1';

export class AttendanceServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-attendance", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-attendance", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-attendance", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-attendance", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-attendance", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-attendance", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(AttendanceServiceFactory.MemoryPersistenceDescriptor, AttendanceMemoryPersistence);
		this.registerAsType(AttendanceServiceFactory.FilePersistenceDescriptor, AttendanceFilePersistence);
		this.registerAsType(AttendanceServiceFactory.MongoDbPersistenceDescriptor, AttendanceMongoDbPersistence);
		this.registerAsType(AttendanceServiceFactory.ControllerDescriptor, AttendanceController);
		this.registerAsType(AttendanceServiceFactory.HttpServiceDescriptor, AttendanceHttpServiceV1);
	}
	
}
