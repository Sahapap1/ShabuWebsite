const express = require('express')
const app = express()
const socketIO = require('socket.io')
const cors = require('cors')

app.use(cors(
    
))

const server = app.listen(3000, () => {
    console.log('server is running......')
})

const io = socketIO(server, {
    cors: {
        origin: 'http://127.0.0.1:5500', // ระบุ origin ที่อนุญาตให้เชื่อมต่อ Socket.IO
        methods: ['GET', 'POST'],       // อนุญาตเฉพาะ GET และ POST
        credentials: true               // อนุญาตให้ส่ง cookies หรือ headers ที่มี credentials
    }
});

io.on('connection', (socket) => {
    console.log("client socket connected.....")

    socket.on('order', (response) => {

        io.emit('kitchen',response)
    })
})

