module.exports = io => {

  io.sockets.on("connection", socket => {
    console.log(socket.id)
  })
}