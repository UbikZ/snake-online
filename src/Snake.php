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
    const CLIENT_GAME_USER_SEND_DIRECTION       = 'client.game.user.send.direction';
    const CLIENT_GAME_USER_RECEIVE_POSITIONS    = 'client.game.user.receive.positions';

    // Sent by the Server
    const SERVER_USER_NOTIFY                    = 'server.user.notify';
    const SERVER_GAME_LOAD                      = 'server.game.load';
    const SERVER_GAME_USERS_POSITIONS           = 'server.game.users.positions';
    const SERVER_GAME_USERS_DIRECTIONS          = 'server.game.users.directions';


    /** @var \SplObjectStorage  */
    protected $clients;
    /** @var array  */
    protected $positions = [];

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
                    $this->clientGameUserSendPositions($from, $data['content']);
                    break;
                case self::CLIENT_GAME_USER_RECEIVE_POSITIONS:
                    $this->clientGameUserReceivePositions($from, $data['content']);
                    break;
                case self::CLIENT_GAME_USER_SEND_DIRECTION:
                    $this->clientGameUserSendDirection($from, $data['content']);
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
        unset($this->positions[$conn->resourceId]);

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
        $this->positions[$conn->resourceId]['positions'] = $data['positions'];
        $positions = $this->positions;
        unset($positions[$conn->resourceId]);
        // Broadcast id / other snakes positions to client
        $authMsg = $this->prepare(self::SERVER_GAME_LOAD, [
            'username' => $conn->resourceId,
            'snakes' => $this->positions
        ]);
        $this->broadcast($authMsg, $conn);

        // Broadcast information about new connection to other clients
        $msg = $this->prepare(self::SERVER_USER_NOTIFY, [
            'type' => 'info',
            'message' => 'New player ('.$conn->resourceId.') connected !',
        ]);
        $this->broadcast($msg, $conn, false);

        // Broadcast welcome message to client
        $msg['content']['message'] = 'Welcome '.$conn->resourceId.' !';
        $this->broadcast($msg, $conn);

        // Broadcast client position to other clients
        $positionMsg = $this->prepare(self::SERVER_GAME_USERS_POSITIONS, [
            $conn->resourceId => ['positions' => $data['positions']],
        ]);
        $this->broadcast($positionMsg, $conn, false);
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     */
    private function clientGameUserSendPositions(ConnectionInterface $conn, array $data)
    {
        $this->positions[$conn->resourceId]['positions'] = $data;
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     */
    private function clientGameUserSendDirection(ConnectionInterface $conn, array $data)
    {
        if (isset($data['direction'])) {
            $this->positions[$conn->resourceId]['direction'] = $data['direction'];
        }
        $msg = $this->prepare(
            self::SERVER_GAME_USERS_DIRECTIONS,
            array_map(function($el) { return $el['direction']; }, $this->positions)
        );
        $this->broadcast($msg, $conn, false);
    }

    /**
     * @param ConnectionInterface $conn
     * @param array $data
     */
    private function clientGameUserReceivePositions(ConnectionInterface $conn, array $data)
    {
        $msg = $this->prepare(self::SERVER_GAME_USERS_POSITIONS, $this->positions);
        $this->broadcast($msg, null);
    }

    /*
     * Helpers
     */

    /**
     * @param $action
     * @return array
     */
    private function prepare($action, $content = [])
    {
        return ['type' => $action, 'content' => is_array($content) ? $content : []];
    }

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
