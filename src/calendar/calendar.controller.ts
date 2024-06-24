import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CalendarService } from './calendar.service';
import { AppointmentDto } from './dto/appointment.dto';
import { CalendarGateway } from './calendar.gateway';

@UseGuards(AuthGuard)
@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService,
        private readonly calendarGateway: CalendarGateway
    ) { }

    @Get()
    async getListOfAppoinments(@AuthUser() user) {
        const appointments = await this.calendarService.findAll(user.id);
        return appointments;
    }

    @Get(':appointmentId')
    async getAppoinment(@AuthUser() user,
        @Param('appointmentId', ParseIntPipe) appointmentId: number) {
        const appointment = await this.calendarService.findOne(user.id, appointmentId);
        return appointment;
    }

    @Post()
    async create(@AuthUser() user, @Body() appointment: AppointmentDto) {
        this.calendarGateway.sendAll(user.id, { type: "create", appointment: appointment });
        return await this.calendarService.create(user.id, appointment);
    }

    @Delete(':appointmentId')
    async remove(@AuthUser() user,
        @Param('appointmentId', ParseIntPipe) appointmentId: number) {
        const appointment = await this.calendarService.remove(user.id, appointmentId);
        this.calendarGateway.sendAll(user.id, { type: "deleted", appointment: appointment });
        return appointment;
    }
}
