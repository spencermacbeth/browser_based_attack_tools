<?php

function authenticate() {
    $username = $_POST['j_username'];
    $password = $_POST['j_password'];
    if ($username === 'tomcat' && $password === 'admin') {
        echo '<html><body>Success!<body></html>';
    }
    return '<html><body>Invalid crendentials.<body></html>';
}

return authenticate();