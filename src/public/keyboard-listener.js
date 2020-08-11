export default function createKeyboardListener(document) {
    // input layer
    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
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

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)
    }

    return {
        subscribe,
        registerPlayerId
    }
}
