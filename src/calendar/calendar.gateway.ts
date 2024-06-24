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
export class CalendarGateway implements OnGatewayDisconnect {

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

    sendAll(userId: number, event: any) {
        this.sockets.forEach(socket => {
            if (socket.data.user.id == userId) {
                socket.emit(`calendar`, event);
            }
        });
    }

    @SubscribeMessage('auth')
    async auth(client: Socket) {
        this.sockets.push(client)
    }
}
