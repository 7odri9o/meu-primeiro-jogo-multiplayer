import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  port: process.env.PORT
}

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()
game.start()
game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`)
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
  const playerId = socket.id
  console.log(`Player connected on Server with id: ${playerId}`)

  game.addPlayer({ playerId: playerId })
  socket.emit('setup', game.state)

  socket.on('disconnect', () => {
    game.removePlayer({ playerId: playerId})
    console.log(`> Player disconnected: ${playerId}`)
  })

  socket.on('move-player', (command) => {
    command.playerId = playerId
    command.type = 'move-player'
    game.movePlayer(command)
  })
})

server.listen(config.port, () => {
  console.log(`>Server on listening on port: ${config.port}`)
})