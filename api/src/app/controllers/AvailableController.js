import { 
    startOfDay, 
    endOfDay, 
    setHours, 
    setMinutes, 
    setSeconds,
    format,
    isAfter,
} from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Schedule from '../models/Schedule';

class AvailableController {
    async index(req, res) {
        const { date } = req.query;

        if ( !date ) {
            return res.status(400).json({ error: 'Invalid date' });
        }

        const searchDate = Number(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.params.providerId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
                }
            }
        });

        const available = Schedule.map(time => {
            const [hour, minute] = time.split(':'); 
            const value = setSeconds(
                setMinutes(setHours(searchDate, hour), minute), 
                0
            );

            const available = isAfter(value, new Date()) &&
                !appointments.find(a => format(a.date, "HH:mm") === time);

            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                available
            };
        });

        return res.json(available);
    }

    async show(req, res) {
        return res.json({ ok: true });
    }
}

export default new AvailableController();
