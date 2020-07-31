const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const Filter = require('bad-words')
const {generateMessage}=require('./utils/messages')
const {addUser,removeUser,getUsersInRoom,getUser}=require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketIO(server)


const PORT = process.env.PORT
const publicPath = path.join(__dirname, `../public`)


app.use(express.static(publicPath))


io.on('connection', (socket) => {

    socket.on('sendMessage', (data, callback) => {
        const user=getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(data)) {
            return callback(generateMessage('Profanity is now allowed!'))
        }
        const {text,createdAt}=generateMessage(data)
        io.to(user.room).emit('message', {text,createdAt,user:user.username})
        callback()
    })

    socket.on('sendlocation', ({latitude, longitude}, callback) => {
        const user=getUser(socket.id)

            io.to(user.room).emit('locationMessage', generateMessage(`https://google.com/maps/?q=${latitude},${longitude}`)
    )
        callback()
    })
    socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})

        if(error){
           return  callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage(`Welcome!-   ${user.username}`))
        socket.broadcast.to(user.room).emit('message', generateMessage( `${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('disconnect', () => {
        const user=removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

    })
})
server.listen(PORT, () => {
    console.log(`listening at port${PORT}`)
})
