import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { restaurantValidationSchema } from 'validationSchema/restaurants';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getRestaurants();
    case 'POST':
      return createRestaurant();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRestaurants() {
    const data = await prisma.restaurant
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'restaurant'));
    return res.status(200).json(data);
  }

  async function createRestaurant() {
    await restaurantValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.table_reservation?.length > 0) {
      const create_table_reservation = body.table_reservation;
      body.table_reservation = {
        create: create_table_reservation,
      };
    } else {
      delete body.table_reservation;
    }
    const data = await prisma.restaurant.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
