function sendPOST(host, port, route) {
    const target = `http://${host}:${port}/${route}`;
    const xmlHttp = new XMLHttpRequest();
    const params = JSON.stringify({ data: 'datum1' });
    xmlHttp.open('POST', target);
    xmlHttp.send(params);
}

function sendGET(host, port, route) {
    const target = `http://${host}:${port}/${route}?data=datum1`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', target, false);
    xmlHttp.send('data');
}

(function(send) {
    XMLHttpRequest.prototype.send = function(reqString) {
        console.log(reqString);
        let type = 'POST';
        let req = {};
        try {
            req = JSON.parse(reqString);
        } catch(err) {
            type = 'GET';
            const pieces = reqString.split('=');
            req = pieces.reduce((acc, elm, idx) => {
                if (idx % 2 === 0) return Object.assign(acc, { [elm]: pieces[idx + 1] });
                return acc;
            }, {});
        }
        console.log(req);
        let modifiedReq = Object.keys(req).reduce((acc, key) => {
            return Object.assign(acc, { [key]: prompt(`Enter a value for ${key}:`) });
        }, {});
        if (type === 'GET')
            modifiedReq = Object.keys(modifiedReq).reduce((acc, key) => `${key}=${modifiedReq[key]}&${acc}`, '');
        else
            modifiedReq = JSON.stringify(modifiedReq);
        console.log(modifiedReq);
        send.call(this, modifiedReq);
    };
})(XMLHttpRequest.prototype.send);

sendPOST('localhost', 3000, 'server.php');