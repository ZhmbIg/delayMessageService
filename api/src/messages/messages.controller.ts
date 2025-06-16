import { Controller, Get, Post, Param, Body, Put, Delete, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';
import { EnumMessageStatus } from 'src/common/enums/messageStatus.enum';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Get()
  async findAll() {
    return await this.messagesService.findAll();
  }

  @Get('by-status')
  async findByStatus(@Query('status') status: EnumMessageStatus) {
    return await this.messagesService.findBySatus(status);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.messagesService.findById(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: EnumMessageStatus,
  ) {
    return await this.messagesService.markAsStatus(id, status);
  }

  @Post()
  async create(@Body() dto: CreateMessageDTO) {
    return await this.messagesService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMessageDTO) {
    return await this.messagesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.messagesService.delete(id);
  }
}
