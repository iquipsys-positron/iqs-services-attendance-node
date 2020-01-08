import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class AttendanceV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withRequiredProperty('object_id', TypeCode.String);

        this.withOptionalProperty('start_time', TypeCode.DateTime);
        this.withOptionalProperty('end_time', TypeCode.DateTime);
    }
}
