import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { AutomationDto } from './dto/automation.dto';
import { AutomationService } from './automation.service';

@UseGuards(AuthGuard)
@Controller('automation')
export class AutomationController {
    constructor(private readonly automationService: AutomationService) { }
    @Get()
    async getListOfInstrs(@AuthUser() user) {
        return this.automationService.listOfInstrs(user.id);
    }
    @Get(':instrName')
    async getInstr(@AuthUser() user, @Param('instrName') instrName) {
        return this.automationService.readInstr(user.id, instrName);
    }
    @Post()
    async create(@AuthUser() user, @Body() automation: AutomationDto) {
        return this.automationService.createInstr(user.id, automation.name, automation.code);
    }
    @Post('generate')
    async generate(@AuthUser() user, @Body() automation: AutomationDto) {
        return this.automationService.generateInstr(user.id, automation.name, automation.description);
    }
    @Delete()
    async remove(@AuthUser() user, @Body() automation: AutomationDto) {
        return this.automationService.removeInstr(user.id, automation.name);
    }
    @Patch()
    async update(@AuthUser() user, @Body() automation: AutomationDto) {
        return this.automationService.updateInstr(user.id, automation.name, automation.code);
    }
    @Put()
    async setStatus(@AuthUser() user, @Body() automationDto: AutomationDto) {
        this.automationService.setStatus(user.id, automationDto.name, automationDto.status);
    }
}
