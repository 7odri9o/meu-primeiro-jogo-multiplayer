import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.addPlayer({ playerId: 'player1', playerX: 3, playerY: 2 })
game.addPlayer({ playerId: 'player2', playerX: 9, playerY: 6 })
game.addPlayer({ playerId: 'player3', playerX: 6, playerY: 5 })

game.addFruit({ fruitId: 'maça', fruitX: 7, fruitY: 0})
game.addFruit({ fruitId: 'banana', fruitX: 7, fruitY: 4})
game.addFruit({ fruitId: 'manga', fruitX: 3, fruitY: 8})

console.log(game.state)

sockets.on('connection', (socket) => {
  const playerId = socket.id
  console.log(`Player connected on Server with id: ${playerId}`)
  socket.emit('setup', game.state)
})

server.listen(3000, '192.168.56.102', () => {
  console.log('> Server listening on port: 3000')
})