import createGame from './public/game.js'
import express from 'express'
import http from 'http'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe((command) => {
    sockets.emit(command.type, command)
})

game.addFruit({fruitId: 'fruit1', fruitX: 3, fruitY: 5})

console.log(game.state)
sockets.on('connection', (socket) => {
    const playerId = socket.id
    game.addPlayer({playerId})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId})
    })
})

server.listen(8080, () => {
    console.log('server listening port 8080')
})
