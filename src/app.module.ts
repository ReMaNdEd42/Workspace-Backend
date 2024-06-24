import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './user/users.controller';
import { UserService } from './user/user.service';
import { ContactsService } from './contacts/contacts.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ContactsController } from './contacts/contacts.controller';
import { StorageService } from './storage/storage.service';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { AutomationService } from './automation/automation.service';
import { AutomationController } from './automation/automation.controller';
import { StorageController } from './storage/storage.controller';
import { ScheduleService } from './automation/schedule.service';
import { StorageGateway } from './storage/storage.gateway';
import { AuthService } from './auth/auth.service';
import { CalendarGateway } from './calendar/calendar.gateway';
import { GptService } from './gpt/gpt.service';
import { NoteController } from './note/note.controller';
import { NoteService } from './note/note.service';
import { NoteGateway } from './note/note.gateway';

@Module({
  imports: [ConfigModule.forRoot()],

  controllers: [AuthController, UsersController, ChatController,
    ContactsController, CalendarController, AutomationController,
    StorageController, NoteController],

  providers: [UserService, ContactsService, ChatService,
    StorageService, ChatGateway, CalendarService,
    AutomationService, ScheduleService, StorageGateway,
    AuthService, CalendarGateway, NoteGateway, GptService, NoteService],
})

export class AppModule { }
