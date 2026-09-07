import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from '../errors/AppError';
import { prisma } from '../config/prisma';
import { UserRole } from '../constants/roles';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const auth = (...requiredRoles: UserRole[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(401, 'Unauthorized access! You must provide a valid Bearer token.');
      }

      const token = authHeader.split(' ')[1];
      const verifiedUser = jwt.verify(token, config.jwt.secret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: verifiedUser.id, deletedAt: null },
      });

      if (!user) {
        throw new AppError(404, 'User account associated with this token not found.');
      }

      if (user.status === 'BLOCKED') {
        throw new AppError(403, 'Your account has been blocked by an administrator.');
      }

      if (requiredRoles.length && !requiredRoles.includes(user.role as UserRole)) {
        throw new AppError(403, `Forbidden: Access denied. Requires role [${requiredRoles.join(', ')}].`);
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
