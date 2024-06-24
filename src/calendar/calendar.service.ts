import { Injectable } from '@nestjs/common';
import { Appointment } from './appointment.model';
import { AppointmentDto } from './dto/appointment.dto';

@Injectable()
export class CalendarService {

    async create(userId: number, appointment: AppointmentDto) {
        return await Appointment.create({
            userId: userId,
            name: appointment.name,
            note: appointment.note,
            endTime: appointment.endTime,
            startTime: appointment.startTime
        })

    }
    async findAll(userId: number) {
        return await Appointment.findAll(
            {
                where: {
                    userId: userId,
                }
            }
        )
    }
    async findOne(userId: number, appointmentId: number) {
        return await Appointment.findOne(
            {
                where: {
                    id: appointmentId,
                    userId: userId,
                }
            }
        )
    }
    async remove(userId: number, appointmentId: number) {
        await Appointment.destroy(
            {
                where: {
                    id: appointmentId,
                    userId: userId,
                }
            }
        )
    }
}
