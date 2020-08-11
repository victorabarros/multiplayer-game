export default function createGame() {
    // rules layer
    const currentPlayerId = 'player1'
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        state.players[command.playerId] = {
            x: 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width),
            y: 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)
        }

        notifyAll({
            type: 'add-player',
            playerId: command.playerId,
            playerX: state.players[command.playerId].x,
            playerY: state.players[command.playerId].y,
        })
    }

    function removePlayer({playerId}) {
        delete state.players[playerId]
    }

    function addFruit(command) {
        state.fruits[command.fruitId] = {
            x: command.fruitX,
            y: command.fruitY
        }
    }

    function removeFruit({fruitId}) {
        delete state.fruits[fruitId]
    }

    function checkForCollision(playerId) {
        const player = state.players[playerId]
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]

            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`Collision`)
                removeFruit({fruitId})
            }
        }
    }

    function movePlayer(command) {
        const acceptedActions = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) {
                    player.y--
                }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) {
                    player.y++
                }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) {
                    player.x++
                }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) {
                    player.x--
                }
            }
        }

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = game.state.players[playerId]
        const action = acceptedActions[keyPressed]

        if (player && action) {
            action(player)
            checkForCollision(playerId)
        }
    }

    return {
        addFruit,
        addPlayer,
        movePlayer,
        notifyAll,
        removeFruit,
        removePlayer,
        setState,
        state,
        subscribe,
    }
}
