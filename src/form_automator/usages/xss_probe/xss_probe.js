// An array of default credentials for various Apache admin pages
const inputs = [
    {
        'selling_price': '<script id="xss"></script>',
    },
    {
        'selling_price': '<ScRiPt id="xss"></ScRiPt>',
    },
    {
        'selling_price': '1000',
    }
];
const parameterNames = [ 'selling_price' ]; // the names of the form element
const action = 'http://localhost:3000/xss_example_server.php'; // page to send to the form data tos
const method = 'POST'; // http method used
const interval = 3000; // wait 3 seconds between requests
const timeout = 1000; // give the form 1 second to load

function processor(idMarker, acc) {
    // search for the existence of a successfully injected script in a depth-first manner
    function depthFirstSearch(root, found = false) {
        if (root.tagName === undefined) return found;
        if (root.tagName.toLowerCase() === 'script' && root.id === idMarker) return true;
        for (let i = 0; i < root.childNodes.length; i++) {
            if (found === true) return true;
            found = depthFirstSearch(root.childNodes[i], found);
        }
        return found;
    }

    const successes = acc.filter(elm => depthFirstSearch(elm.response.document.children[0])).map(elm => elm.inputs);

    // log results to console
    if (successes.length === 0) {
        console.log('None of the provided inputs produced a successful result.');
        return;
    }
    console.log('The following attempts were successful:');
    console.log(JSON.stringify(successes, null, 4));
}

const boundProcessor = processor.bind(null, 'xss');

function automateFormAttempts(
    inputs,
    parameterNames,
    action,
    method = 'POST',
    processor = (acc) => { console.log(JSON.stringify(acc, null, 4)) },
    interval = 0,
    responseTimeout = 1000
) {
    // styling for the windows created
    const windowSize = 'status=0,title=0,height=600,width=800,scrollbars=1';
    
    // accumulator to store results in
    const acc = [];

    // helper to add input data to form a element
    function appendFormData(input, elementName, form) {
        const formElement = document.createElement('input');
        formElement.type = 'text';
        formElement.name = elementName;
        formElement.value = input;
        form.appendChild(formElement);
    }

    // attempt all provided inputs
    inputs.forEach((input, idx)  => {
        // nest inside a timeout to impose delay between requests
        setTimeout(() => {
            // build window and form
            const windowName = `window${idx}`;
            const attemptForm = document.createElement('form');
            attemptForm.style = 'display: none;'
            attemptForm.target = windowName;
            attemptForm.method = method;
            attemptForm.action = action;
            parameterNames.forEach(selector => appendFormData(input[selector], selector, attemptForm));
            document.body.appendChild(attemptForm);
            const attempt = window.open('', windowName, windowSize);
            
            // submit form to window
            if (attempt) attemptForm.submit();

            // wait for the specified responseTimeout and add to the acc
            setTimeout(() => {
                acc[idx] = {
                    inputs: input,
                    response: attempt,
                };

                // process the results in the accumulator
                if (idx === inputs.length - 1) {
                    processor(acc);
                }
            }, responseTimeout);
        }, idx * interval)
    });
}

automateFormAttempts(inputs, parameterNames, action, method, boundProcessor, interval, timeout);
