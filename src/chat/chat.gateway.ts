import { UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayDisconnect,
    SubscribeMessage
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { AuthGuard } from 'src/guards/auth.gateway.guard';


@WebSocketGateway({
    cors: {
        origin: '*',
    },
})

@UseGuards(AuthGuard)
export class ChatGateway implements OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;
    sockets: Array<Socket>;

    constructor() {
        this.sockets = Array<Socket>();
    }

    handleDisconnect(client: Socket) {
        for (let i = 0; i < this.sockets.length; i++) {
            if (this.sockets[i] === client) {
                this.sockets.splice(i, 1);
                break;
            }
        }
    }

    sendAll(chatId: number, memberId: number, messageDto: any) {

        this.sockets.forEach(socket => {
            if (memberId == socket.data.user.id) {
                console.log('sendTo ', memberId, chatId)
                socket.emit(`chat/${chatId}`,
                    {
                        message: messageDto.message,
                        time: messageDto.time,
                        isMine: socket.data.user.id == messageDto.userId
                    }
                )
            }
        });

        this.sockets.forEach(socket => {
            if (memberId == socket.data.user.id) {
                socket.emit(`chat`, { chatId, ...messageDto })
            }
        });
    }

    @SubscribeMessage('auth')
    async auth(client: Socket) {
        this.sockets.push(client)
    }
}
