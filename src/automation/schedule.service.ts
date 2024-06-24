import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io-client';
import { AuthService } from 'src/auth/auth.service';
import { CalendarService } from 'src/calendar/calendar.service';
import { ChatService } from 'src/chat/chat.service';
import { GptService } from 'src/gpt/gpt.service';
import { StorageService } from 'src/storage/storage.service';
const { io } = require('socket.io-client');
const vm = require('vm');

@Injectable()
export class ScheduleService {

    constructor(
        private readonly chatService: ChatService,
        private readonly calendarService: CalendarService,
        private readonly storageService: StorageService,
        private readonly authService: AuthService,
        private readonly gptService: GptService
    ) { }

    private runningInstrs: Map<any, any> = new Map<any, any>();

    async run(userId: number, name: string, code: string) {
        if (!this.runningInstrs.has(JSON.stringify({
            userId: userId,
            name: name
        }))) {

            let jwt = await this.authService.eternalLogin(userId);

            const socket: Socket = io('http://localhost:3000', {
                auth: {
                    "Authorization": `Bearer ${jwt}`
                }
            });

            socket.on('connect', () => {
                socket.emit('auth');
            });

            const init = `let interval = setInterval(() => {
                if (!flag) {
                    socket.disconnect();
                    clearInterval(interval);
                }
            }, 1000)`

            const onMessage = (callbackfn) => {
                socket.on(`chat`, (data) => {
                    callbackfn(data.message, data.time, data.userId, data.chatId);
                });
            }

            const onStorageEvent = (callbackfn) => {
                socket.on(`storage`, (data) => {
                    callbackfn(data.type, data.file);
                });
            }

            const onCalendarEvent = (callbackfn) => {
                socket.on(`calendar`, (data) => {
                    callbackfn(data.type, data.appointment.name, data.appointment.note, data.appointment.startTime, data.appointment.endTime);
                });
            }

            const onNoteEvent = (callbackfn) => {
                socket.on(`note`, (data) => {
                    callbackfn(data.type, data.name, data.drawables);
                });
            }

            const context = {

                //neaded
                flag: true,
                socket,

                //additional
                setInterval,
                clearInterval,
                console,

                //events
                onMessage,
                onStorageEvent,
                onCalendarEvent,
                onNoteEvent,

                //actions
                sendMessage: (userId, chatId, message) => {
                    this.chatService.sendMessage(userId, chatId, message, true)
                        .catch((err) => console.error(err))
                },

                addAppointment: (userId, name, note, startTime, endTime) => {
                    this.calendarService.create(userId, { name, note, startTime, endTime })
                        .catch((err) => console.error(err))
                },


                removeAppointment: (userId, appointmentId) => {
                    this.calendarService.remove(userId, appointmentId)
                        .catch((err) => console.error(err))
                },                

                createFile: (userId, path, content) => {
                    this.storageService.createFile(userId, path, content)
                        .catch((err) => console.error(err))
                },

                createDirectory: (userId, path) => {
                    this.storageService.createDirectory(userId, path)
                        .catch((err) => console.error(err))
                },

                askAboutContent: (content) => {
                    this.gptService.askAboutContent(content)
                        .catch((err) => console.error(err))
                },

            }

            vm.createContext(context);

            this.runningInstrs.set(
                JSON.stringify({
                    userId: userId,
                    name: name
                }),
                {
                    context,
                    promise: new Promise((resolve, reject) => {
                        try {
                            vm.runInContext([init, code].join('\n'), context);
                        }
                        catch (err) {
                            console.error(err);
                        }
                    })
                })
        }
    }
    async stop(userId: number, name: string) {

        let active = this.runningInstrs.get(
            JSON.stringify({
                userId: userId,
                name: name
            }));

        if (active) {

            active.context.flag = false;

            this.runningInstrs.delete(
                JSON.stringify({
                    userId: userId,
                    name: name
                }));
        }
    }

    async list(userId: number) {
        return Array.from(this.runningInstrs.keys()).map(
            instr => {
                if (JSON.parse(instr).userId == userId) {
                    return JSON.parse(instr);
                }
            }
        )
    }
}