import { Server } from 'socket.io'
import { backendProxy } from '../lib/db/db.js'

function configureServer(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
          }   
    });
    
    io.on('connection', (socket) => {
        socket.on('join', async (id,token) => {
            socket.join(id);

            let api = await backendProxy({
                route: 'chatGet',
                backendParams: {
                    room: id,
                    token: token || '4'
                }
            });

            socket.emit('load',api.data);
        })
        socket.on('chat', async (content,room,token) => {
            let api = await backendProxy({
                route: 'chatAdd',
                backendParams: {
                    token: token || '4',
                    content,
                    room
                }
            })
            io.to(room).emit('chat',api.data);
        })
    })
}

export {
    configureServer
};