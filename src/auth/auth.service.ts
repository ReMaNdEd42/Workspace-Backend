import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';


@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService) { }
    async eternalLogin(userId) {
        const user = await this.userService.findUserById(userId);
        return sign({ id: user.get('id') }, user.get().password);
    }
}