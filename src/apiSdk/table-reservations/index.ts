import axios from 'axios';
import queryString from 'query-string';
import { TableReservationInterface } from 'interfaces/table-reservation';
import { GetQueryInterface } from '../../interfaces';

export const getTableReservations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/table-reservations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTableReservation = async (tableReservation: TableReservationInterface) => {
  const response = await axios.post('/api/table-reservations', tableReservation);
  return response.data;
};

export const updateTableReservationById = async (id: string, tableReservation: TableReservationInterface) => {
  const response = await axios.put(`/api/table-reservations/${id}`, tableReservation);
  return response.data;
};

export const getTableReservationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/table-reservations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTableReservationById = async (id: string) => {
  const response = await axios.delete(`/api/table-reservations/${id}`);
  return response.data;
};
