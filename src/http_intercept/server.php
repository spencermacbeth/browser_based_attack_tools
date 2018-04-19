<?php

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET': file_put_contents('./' . json_encode($_GET) . '.1.txt', json_encode($_GET)); break;
    case 'POST': file_put_contents('./' . json_encode($_POST['data']) . '.2.txt', json_encode($_POST['data'])); break;
}
