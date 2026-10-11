// events/appEvents.js
// EventEmitter is a core Node.js module (no npm install needed).
// It works like an announcement system:
//   - one part of the code EMITS (announces) an event:  appEvents.emit('blockCreated', data)
//   - another part LISTENS for it:                      appEvents.on('blockCreated', fn)
// The controller doesn't need to know what happens after it announces.
// Here, the listener writes a line to audit.log for every admin change.

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const appEvents = new EventEmitter();

// audit.log is created in the server folder
const logFile = path.join(__dirname, '..', 'audit.log');

function writeAuditLine(eventName, data) {
  const line = `${new Date().toISOString()} ${eventName} ${data.code} by ${data.by}\n`;

  // fs.appendFile adds text to the end of a file (and creates it if missing).
  // It is ASYNCHRONOUS with a CALLBACK: Node keeps working, and when the
  // file write is done it calls our function, with err if something failed.
  fs.appendFile(logFile, line, (err) => {
    if (err) {
      console.error('Could not write audit log:', err.message);
    }
  });
}

// Listeners: run writeAuditLine whenever these events are emitted
appEvents.on('blockCreated', (data) => writeAuditLine('blockCreated', data));
appEvents.on('blockUpdated', (data) => writeAuditLine('blockUpdated', data));
appEvents.on('blockDeleted', (data) => writeAuditLine('blockDeleted', data));

module.exports = appEvents;
