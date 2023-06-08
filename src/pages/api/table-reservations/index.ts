import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { tableReservationValidationSchema } from 'validationSchema/table-reservations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTableReservations();
    case 'POST':
      return createTableReservation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTableReservations() {
    const data = await prisma.table_reservation
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'table_reservation'));
    return res.status(200).json(data);
  }

  async function createTableReservation() {
    await tableReservationValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.table_reservation.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
