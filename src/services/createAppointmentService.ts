import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface Request {
  provider_id: string;
  date: Date;
}

class createAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentOfDate = startOfHour(date);

    const findAppointmentInSomeDate = await appointmentsRepository.findOne(
      appointmentOfDate,
    );

    if (findAppointmentInSomeDate) {
      throw Error('Appointment already booked');
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentOfDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default createAppointmentService;
