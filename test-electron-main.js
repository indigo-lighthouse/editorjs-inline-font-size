const { app } = require('electron')

// This fixes:
//   Uncaught Error: Failed to read a named property 'href' from 'Location': Blocked a frame with origin "file://" from accessing a cross-origin frame.
app.commandLine.appendSwitch('disable-site-isolation-trials')
