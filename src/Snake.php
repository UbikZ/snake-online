<?php

namespace Ubikz\MMS;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/**
 * Class Snake.
 */
class Snake implements MessageComponentInterface
{
    // Sent by the client
    const CLIENT_USER_CONNECT                   = 'client.user.connect';
    const CLIENT_GAME_USER_SEND_POSITIONS       = 'client.game.user.send.positions';
    const CLIENT_GAME_USER_RECEIVE_POSITIONS    = 'client.game.user.receive.positions';

    // Sent by the Server
    const SERVER_USER_NOTIFY                    = 'server.user.notify';
    const SERVER_GAME_LOAD                      = 'server.game.load';
    const SERVER_GAME_USERS_POSITIONS           = 'server.game.users.positions';


    /** @var \SplObjectStorage  */
    protected $clients;

    /**
     *
     */
    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
    }

    /**
     * @param ConnectionInterface $conn
     */
    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    /**
     * @param ConnectionInterface $from
     * @param string $msg
     */
    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = $this->parse($msg);
        $numRecv = count($this->clients) - 1;

        if (isset($data['type'])) {
            switch ($data['type']) {
                case self::CLIENT_USER_CONNECT:
                    $this->clientUserConnect($from, $data['content']);
                    break;
                case self::CLIENT_GAME_USER_SEND_POSITIONS:
                    break;
                case self::CLIENT_GAME_USER_RECEIVE_POSITIONS:
                    break;
                default:
                    echo "No action type for {$from->resourceId} !\n";
                    break;
            }
        } else {
            echo sprintf(
                "Connection %d sending message \"%s\" to %d other connection(s)\n",
                $from->resourceId, $msg, $numRecv
            );
        }
    }

    /**
     * @param ConnectionInterface $conn
     */
    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    /**
     * @param ConnectionInterface $conn
     * @param \Exception $e
     */
    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }

    /*
     * Business methods
     */

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     */
    private function clientUserConnect(ConnectionInterface $conn, array $data)
    {
        $msg = ['type' => self::SERVER_USER_NOTIFY, 'content' => [
            'type' => 'info',
            'message' => 'New player ('.$conn->resourceId.') connected !',
        ]];
        $this->broadcast($msg, $conn, false);
        $msg['content']['message'] = 'Welcome '.$conn->resourceId.' !';
        $this->broadcast($msg, $conn);
    }

    /*
     * Helpers
     */

    /**
     * @param $msg
     * @return array|mixed
     */
    private function parse($msg)
    {
        $json = json_decode($msg, true);

        return $json ?: [];
    }

    /**
     * @param $msg
     * @param $dest
     * @param bool|true $isIncluded
     */
    private function broadcast($msg, $dest, $isIncluded = true)
    {
        $msg = json_encode($msg);
        foreach ($this->clients as $client) {
            if ($dest) {
                if ($isIncluded && $dest == $client) {
                    $client->send($msg);
                } else if (!$isIncluded && $dest != $client) {
                    $client->send($msg);
                }
            } else {
                $client->send($msg);
            }
        }
    }
}
