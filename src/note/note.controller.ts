import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { NoteDto } from './dto/note.dto';
import { NoteService } from './note.service';
import { NoteGateway } from './note.gateway';
import { GptService } from 'src/gpt/gpt.service';

@UseGuards(AuthGuard)
@Controller('note')
export class NoteController {
    constructor(private readonly noteService: NoteService,
        private readonly noteGateway: NoteGateway,
        private readonly gptService: GptService
    ) { }

    @Get()
    async getList(@AuthUser() user) {
        return this.noteService.listOf(user.id);
    }
    @Get(':noteName')
    async read(@AuthUser() user, @Param('noteName') noteName) {
        return this.noteService.read(user.id, noteName);
    }
    @Get(':noteName/recognize')
    async recognize(@AuthUser() user, @Param('noteName') noteName) {
        const json = await this.noteService.read(user.id, noteName);
        return this.gptService.askAboutContent(JSON.stringify(json));
    }
    @Post()
    async create(@AuthUser() user, @Body() note: NoteDto) {
        this.noteGateway.sendAll(user.id, {type: 'create', name: note.name});
        return this.noteService.create(user.id, note.name, JSON.stringify(note.drawables));
    }

    @Delete()
    async remove(@AuthUser() user, @Body() note: NoteDto) {
        // this.noteGateway.sendAll(user.id, {type: 'delete', name: note.name});
        return this.noteService.remove(user.id, note.name);
    }
    @Patch()
    async update(@AuthUser() user, @Body() note: NoteDto) {
        this.noteGateway.sendAll(user.id, {type: 'update', name: note.name, drawables: note.drawables});
        return this.noteService.update(user.id, note.name, JSON.stringify(note.drawables));
    }
}
