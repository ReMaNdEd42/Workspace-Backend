import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Chat } from './chat.model';
import { ChatMember } from './chat.member.model';
import { StorageService } from 'src/storage/storage.service';
import { json2csv, csv2json } from 'json-2-csv';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
    constructor(private readonly storageService: StorageService,
        private readonly chatGateway: ChatGateway) { }
    async create(name: string, members: Array<number>) {

        const chat = (await Chat.create({ name: name })).get();

        for (let userId of members) {
            await ChatMember.create(
                {
                    chatId: chat.id,
                    userId: userId,
                }
            )
        }
        await this.storageService.createFile('messanger', `${chat.id}/0`);
    }
    async findById(chadId: number) {
        return (await Chat.findOne({
            where: {
                id: chadId,
            }
        })).get();
    }

    async findByUserId(userId: number) {
        const userChatMember = await ChatMember.findAll(
            {
                where: {
                    userId: userId
                }
            }
        )
        return await Promise.all(userChatMember.map(
            async (chatMember) =>
                (await Chat.findOne({
                    where: {
                        id: chatMember.get().chatId,
                    }
                })).get()
        ));
    }

    async sendMessage(userId: number, chatId: number, message: string, trackable = true) {

        const messageBunchs: [] = await this.listOfMessageBunchs(userId, chatId);
        const { pathSuffix } = messageBunchs.pop();

        const messageDto = {
            userId: userId,
            message: message,
            time: Date.now()
        };

        await this.storageService.writeFile('messanger', `${chatId}/${pathSuffix}`,
            `${json2csv([messageDto], { prependHeader: false })}\n`);
        if (trackable) {
            let chatMembers = await ChatMember.findAll({ where: { chatId: chatId } });
            chatMembers.forEach(member => {
                this.chatGateway.sendAll(chatId, member.get().userId, messageDto);
            })
        }
    }

    async readMessage(userId: number, chatId: number) {
        const messageBunchs: [] = await this.listOfMessageBunchs(userId, chatId);
        const { pathSuffix } = messageBunchs.pop();
        const encodedMessage = Uint8Array.from(await this.storageService.readFile('messanger', `${chatId}/${pathSuffix}`));
        const messages = csv2json(`${["userId", "message", "time"].join(',')}\n` + new TextDecoder().decode(encodedMessage));
        return messages.map((messageItem: any) => {
            return {
                message: messageItem.message,
                time: messageItem.time,
                isMine: messageItem.userId == userId ? true : false
            }
        })
    }
    async lastMessage(userId: number, chatId: number) {
        const messages = await this.readMessage(userId, chatId);
        if (messages.length) {
            return messages.pop();
        }
    }
    async listOfMessageBunchs(userId: number, chatId: number) {
        const chat = await this.findById(chatId);
        if (!chat) {
            throw new NotFoundException(`Chat doesn't exist.`);
        }
        const chatMember = await ChatMember.findOne({
            where: {
                chatId: chatId,
                userId: userId
            }
        });
        if (!chatMember) {
            throw new ForbiddenException(`You're not in the chat.`);
        }
        return await this.storageService.listFiles('messanger', `${chat.id}`);
    }
    async removeMember(userId: number, chatId: number) {
        ChatMember.destroy({
            where: {
                chatId: chatId,
                userId: userId,
            }
        })
    }
}
