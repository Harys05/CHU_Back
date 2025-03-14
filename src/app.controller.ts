import { Controller, Get, Param, Request, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('/uploads/:filename')
  @ApiTags('Uploads')
  @ApiOperation({ summary: 'Get a file from uploads directory' })
  @ApiParam({ name: 'filename', description: 'Name of the file to retrieve' })
  getFile(@Param('filename') filename: string, @Res() res: Response): void {
    const filePath = join(__dirname, '..', 'public', 'uploads', filename);
    return res.sendFile(filePath);
  }

  @Get()
  async getHello(): Promise<string> {
    return 'Hello';
  }
}
