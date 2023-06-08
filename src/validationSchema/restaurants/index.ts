import * as yup from 'yup';
import { tableReservationValidationSchema } from 'validationSchema/table-reservations';

export const restaurantValidationSchema = yup.object().shape({
  name: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  user_id: yup.string().nullable().required(),
  table_reservation: yup.array().of(tableReservationValidationSchema),
});
