import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    MessageBody
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

interface User {
    id: string;
    username?: string;
}

@WebSocketGateway(3002, {
    cors: {
        origin: '*'
    },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private users: Map<string, User> = new Map();

    handleConnection(client: Socket) {
        const user: User = {
            id: client.id,
            username: `User_${client.id.substring(0, 5)}`
        };

        this.users.set(client.id, user);

        client.broadcast.emit('user-joined', {
            userId: user.id,
            username: user.username,
            message: `${user.username} has joined the chat`
        });

        client.emit('user-list', Array.from(this.users.values()));
    }

    handleDisconnect(client: Socket) {
        const user = this.users.get(client.id);

        if (user) {
            this.users.delete(client.id);

            client.broadcast.emit('user-left', {
                userId: user.id,
                username: user.username,
                message: `${user.username} has left the chat`
            });
        }
    }

    @SubscribeMessage('set-username')
    handleSetUsername(
        @ConnectedSocket() client: Socket,
        @MessageBody() username: string
    ) {
        const user = this.users.get(client.id);
        if (user) {
            const oldUsername = user.username;
            user.username = username;
            this.users.set(client.id, user);

            this.server.emit('username-changed', {
                userId: client.id,
                oldUsername,
                newUsername: username
            });
        }
    }

    @SubscribeMessage('public-message')
    handlePublicMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: string
    ) {
        const user = this.users.get(client.id);
        if (user) {
            this.server.emit('public-message', {
                userId: client.id,
                username: user.username,
                message
            });
        }
    }

    @SubscribeMessage('private-message')
    handlePrivateMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: {
            recipientId: string,
            message: string
        }
    ) {
        const sender = this.users.get(client.id);
        const recipient = this.users.get(payload.recipientId);

        if (sender && recipient) {
            this.server.to(payload.recipientId).emit('private-message', {
                userId: client.id,
                username: sender.username,
                message: payload.message
            });

            client.emit('private-message', {
                userId: client.id,
                username: sender.username,
                message: payload.message
            });
        }
    }
}