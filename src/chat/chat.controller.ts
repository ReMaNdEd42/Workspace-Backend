import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { MessageDto } from './dto/message.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) { }

    @Post()
    async createChat(@Body() chatDto: ChatDto) {
        this.chatService.create(chatDto.name, chatDto.members);
    }

    @Get()
    async AllChats(@AuthUser() user) {
        const chats = await this.chatService.findByUserId(user.id);
        return await Promise.all(
            chats.map(async (chat) => {
                const messages = await this.chatService.readMessage(user.id, chat.id);
                return {
                    ...chat,
                    lastMessage: messages.length ? messages[messages.length-1].message : null,
                    lastTime: messages.length ? messages[messages.length-1].time: null,
                    count: messages.length,
                }
            })
        );
    }

    @Post(':chatId')
    async send(@AuthUser() user,
        @Param('chatId', ParseIntPipe) chatId: number,
        @Body() messageDto: MessageDto) {
        await this.chatService.sendMessage(user.id, chatId, messageDto.message);
    }

    @Get(':chatId')
    async getMessages(@AuthUser() user,
        @Param('chatId', ParseIntPipe) chatId: number) {
        return this.chatService.readMessage(user.id, chatId);
    }


    @Get(':chatId/last')
    async getLastMessage(@AuthUser() user,
        @Param('chatId', ParseIntPipe) chatId: number) {
        return this.chatService.lastMessage(user.id, chatId);
    }

    @Delete(':chatId')
    async leaveFromChat(@AuthUser() user,
        @Param('chatId', ParseIntPipe) chatId: number) {
        return this.chatService.removeMember(user.id, chatId);
    }
}
