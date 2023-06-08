import * as yup from 'yup';

export const tableReservationValidationSchema = yup.object().shape({
  reservation_date: yup.date().required(),
  reservation_time: yup.date().required(),
  number_of_guests: yup.number().integer().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  restaurant_id: yup.string().nullable().required(),
  customer_id: yup.string().nullable().required(),
});
