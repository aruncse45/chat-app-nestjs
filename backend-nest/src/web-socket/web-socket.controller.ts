import { Body, Controller, Post } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';

@Controller('webSocket')
export class WebSocketController {
  constructor(private readonly webSocketService: WebSocketService) {}

  @Post('sendPublicMessage')
  sendPublicMessage(@Body('message') message: string) {
    return this.webSocketService.sendPublicMessage(message);
  }

  @Post('sendPrivateMessage')
  sendPrivateMessage(@Body('message') message: string) {
    return this.webSocketService.sendPrivateMessage(message);
  }
}
