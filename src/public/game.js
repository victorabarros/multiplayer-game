export default function createGame() {
    // rules layer
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    }

    const observers = []

    function start() {
        const frequency = 2000
        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction) {
        // Method do substribe observer
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        // discharge event to all observers
        for (const observer of observers) {
            observer(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const x = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const y = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: x,
            y: y
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: x,
            playerY: y
        })
    }

    function removePlayer(id) {
        delete state.players[id]

        notifyAll({
            type: 'remove-player',
            playerId: id
        })
    }

    function addFruit(command) {
        const id = command ? command.fruitId : Math.floor(Math.random() * 10000000)

        state.fruits[id] = {
            x: command ? command.fruitX : Math.floor(Math.random() * state.screen.width),
            y: command ? command.fruitY : Math.floor(Math.random() * state.screen.height)
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: id,
            fruitX: state.fruits[id].x,
            fruitY: state.fruits[id].y
        })
    }

    function removeFruit(id) {
        delete state.fruits[id]

        notifyAll({
            type: 'remove-fruit',
            fruitId: id,
        })
    }

    function checkForFruitCollision(player) {
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]

            if (player.x === fruit.x && player.y === fruit.y) {
                removeFruit(fruitId)
            }
        }
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y - 1 >= 0) { player.y-- }
            },
            ArrowDown(player) {
                if (player.y + 1 < state.screen.height) { player.y++ }
            },
            ArrowRight(player) {
                if (player.x + 1 < state.screen.width) { player.x++ }
            },
            ArrowLeft(player) {
                if (player.x - 1 >= 0) { player.x-- }
            }
        }

        const player = state.players[command.playerId]
        const moveFunction = acceptedMoves[command.keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
            checkForFruitCollision(player)
        }
    }

    return {
        addFruit,
        addPlayer,
        movePlayer,
        removeFruit,
        removePlayer,
        setState,
        start,
        state,
        subscribe,
    }
}
