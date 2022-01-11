const express = require('express')
const path = require('path')
const ejs = require('ejs')
const { Socket } = require('dgram')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname/* , 'public' */)))
app.set('views', path.join(__dirname))
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

let players = {
    player1: null,
    player2: null
}

io.on('connection', socket => {

    console.log(`Socket connected: ${socket.id}`)

    socket.on('setPlayer', player => {
        socket.id = player
        console.log(`Socket connected: ${socket.id}`)

        if (players.player1 == null) {
            players.player1 = player
        } else {
            if (players.player2 == null) {
                players.player2 = player
            } else {
                socket.disconnect()
            }
        }
        socket.broadcast.emit('setPlayers', players) // Configura nome dos players
    })


    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id)
        Object.values(players).forEach((e, i) => {
            if (e == socket.id)
                delete players[Object.keys(players)[i]]
        })
        console.log('players conectados: ' + players)
    })

    socket.on('sendMessage', message => {
        console.log(`${message.autor}: ${message.message}`)
        if (socket.id == players.player1 || socket.id == players.player2) // Bloqueia mensagens de outros players
            socket.broadcast.emit('receiveMessage', message)
    })

    socket.on('refreshGame', (currentGame, playCounter) => {
        socket.broadcast.emit('refresh', currentGame, playCounter)
    })
})


server.listen(779, () => {
    console.log('Server running in port 779...')
})