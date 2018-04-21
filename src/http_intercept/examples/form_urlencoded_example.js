/**
 * Send an example POST request with a x-www-form-urlencoded body to the specified URI.s
 * 
 * @param {*} host 
 * @param {*} port 
 * @param {*} route 
 */
function sendFormDataPOST(host, port, route) {
    const target = `http://${host}:${port}/${route}`;
    const xmlHttp = new XMLHttpRequest();
    const params = 'data=some_data';
    xmlHttp.open('POST', target);
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlHttp.send(params);
}

(function(send) {
    XMLHttpRequest.prototype.send = function(reqString) {

        /**
         * Prompts the user to modify the fields of an object and returns the modified 
         * version of the object.
         * 
         * @param {*} requestObject
         */
        function modifyRequestObject(requestObject) {
            return Object.keys(requestObject).reduce((acc, key) => {
                return Object.assign(acc, { [key]: prompt(`Enter a value for ${key}:`) });
            }, {});;
        }
        
        /**
         * Modifies a x-www-form-urlencoded requestString and sends the modified
         * request data with the provide context bound to the this reference of the sender.
         * 
         * @param {*} reqString 
         * @param {*} send 
         * @param {*} context 
         */
        function sendModifiedJSON(reqString, send, context) {
            const reqObject = JSON.parse(reqString);
            const modifiedReqObject = modifyRequestObject(reqObject)
            const modifiedReq = JSON.stringify(modifiedReqObject);
            send.call(context, modifiedReq);
        }
        
        /**
         * Modifies a JSON requestString and sends the modified
         * request data with the provide context bound to the this reference of the sender.
         * 
         * @param {*} reqString 
         * @param {*} send 
         * @param {*} context 
         */
        function sendModifiedForm(reqString, send, context) {
            const pieces = reqString.split('=');
            const reqObject = pieces.reduce((acc, elm, idx) => {
                if (idx % 2 === 0) return Object.assign(acc, { [elm]: pieces[idx + 1] });
                return acc;
            }, {});
            const modifiedReqObject = modifyRequestObject(reqObject)
            const modifiedReq = Object.keys(modifiedReqObject)
                .reduce((acc, key) => `${key}=${modifiedReqObject[key]}&${acc}`, '');
            send.call(context, modifiedReq);
        }

        // determine the appropriate function to process the request string
        let type = 'JSON';
        let sender = null;
        try {
            const test = JSON.parse(reqString);
            sender = sendModifiedJSON;
        } catch(err) {
            type = 'FORM';
            sender = sendModifiedForm;
        }
        sender(reqString, send, this);
    };
})(XMLHttpRequest.prototype.send);

sendFormDataPOST('localhost', 3000, 'server.php');
