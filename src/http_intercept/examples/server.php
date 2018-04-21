<?php

// log request body to a output.txt
file_put_contents('./output.txt', file_get_contents('php://input'));