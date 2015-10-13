<?php

use Ratchet\Server\IoServer;
use Ubikz\MMS\Snake;

require __DIR__.'/vendor/autoload.php';

$server = IoServer::factory(
    new \Ratchet\Http\HttpServer(new \Ratchet\WebSocket\WsServer(new Snake())),
    3000
);

$server->run();
