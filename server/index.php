<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

$app = new Ratchet\App('localhost', 8000);
$app->route('/chat', new \Ubikz\SnakeOnline\Application\Chat());
$app->route('/echo', new Ratchet\Server\EchoServer, array('*'));
$app->run();
