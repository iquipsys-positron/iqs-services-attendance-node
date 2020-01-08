let AttendanceProcess = require('../obj/src/container/AttendanceProcess').AttendanceProcess;

try {
    new AttendanceProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
