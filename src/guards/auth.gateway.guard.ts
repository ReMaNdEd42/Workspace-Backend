import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify, decode, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { UserService } from '../user/user.service';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UserService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const authHeader = client.handshake.auth['Authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const [, token] = authHeader.split(' ');

    try {
      const payload = decode(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.usersService.findUserById(payload['id']);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      verify(token, user.getDataValue('password'));
      client.data.user = user.get();
      return true;

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
}