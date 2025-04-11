import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('cache-write')
  writeCache(@Res() response: Response): Response {
    response.setHeader('Cache-Control', 'private, max-age=80');
    return response.send('The response is cached for 60 seconds');
  }
  @Get('headers-read')
  readCache(@Req() request: Request, @Res() response: Response): Response {
    console.log(request.headers['user-agent'] as string);
    return response.json(request.headers['user-agent'] as string);
  }

  @Get('modify-headers')
  modifyHeaders(@Res() response: Response): Response {
    response.setHeader('X-Modified-User-Agent', "Modified User Agent");
    return response.send('User Agent Modified');
  }
}
