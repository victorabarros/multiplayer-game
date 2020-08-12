export default function createKeyboardListener(document) {
    // input layer
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(id) {
        state.playerId = id
    }

    // TODO código duplicado aqui em em game.js
    // onde deduplicar?
    function subscribe(observerFunction) {
        // Method do substribe observer
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        // discharge event to all observers
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    function handleKeydown({ key }) {
        const command = {
            type: 'move-player', // TODO rename to action
            playerId: state.playerId,
            keyPressed: key
        }

        notifyAll(command)
    }

    document.addEventListener('keydown', handleKeydown)

    return {
        subscribe,
        registerPlayerId
    }
}
