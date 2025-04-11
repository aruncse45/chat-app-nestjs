import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class WebSocketService {
  private server: Server;

  sendPublicMessage(message: any) {
    if (!this.server) {
      throw new Error('Websocket server not initialized');
    }
    return this.server.emit('publicMessage', `${message?.message}`);
  }

  sendPrivateMessage(message: any) {
    if (!this.server) {
      throw new Error('Websocket server not initialized');
    }
    return this.server.emit('privateMessage', `${message.message}`);
  }
}
