import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", (socket) => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx

  Ws.io.on('objetos', (objetos) => {
    console.log(objetos)
  })

  Ws.io.on('notificacion', (notificacion) => {
    console.log(notificacion)
  })
});
