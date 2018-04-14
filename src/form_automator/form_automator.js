/**
 * Attempts to send all the sets of inputs according to the selectors and mappings provided.
 * This is achieved by creating a new window, embedding a form element in that window's DOM, and
 * submitting the form using the specified method (defaults to POST). An optional delay parameter
 * can be provided to specify the time (in miliseconds) to wait between attempts. After submission,
 * the form waits for responseTimeout miliseconds for the response. Once all inputs have been
 * processed, a JSON array containing all the attempts and their corresponding results are logged
 * to the console.
 * 
 * @param {*} inputs
 * @param {*} parameterNames
 * @param {*} action 
 * @param {*} method
 * @param {*} interval 
 * @param {*} responseTimeout 
 */
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
