const mapping: Record<string, string> = {
  'customer-preferences': 'customer_preference',
  restaurants: 'restaurant',
  'table-reservations': 'table_reservation',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
