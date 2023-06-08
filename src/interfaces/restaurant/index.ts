import { TableReservationInterface } from 'interfaces/table-reservation';
import { UserInterface } from 'interfaces/user';

export interface RestaurantInterface {
  id?: string;
  name: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  table_reservation?: TableReservationInterface[];
  user?: UserInterface;
  _count?: {
    table_reservation?: number;
  };
}
