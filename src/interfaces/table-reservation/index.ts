import { RestaurantInterface } from 'interfaces/restaurant';
import { UserInterface } from 'interfaces/user';

export interface TableReservationInterface {
  id?: string;
  restaurant_id: string;
  customer_id: string;
  reservation_date: Date;
  reservation_time: Date;
  number_of_guests: number;
  created_at?: Date;
  updated_at?: Date;

  restaurant?: RestaurantInterface;
  user?: UserInterface;
  _count?: {};
}
