import { Module } from '@nestjs/common';
import { WebSocketController } from './web-socket.controller';
import { WebSocketService } from './web-socket.service';
import { WebsocketGateway } from './web-socket.gateway';

@Module({
  controllers: [WebSocketController],
  providers: [WebSocketService, WebsocketGateway]
})
export class WebSocketModule {}
