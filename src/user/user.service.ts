import { Injectable } from '@nestjs/common';
import { User } from './user.model';

@Injectable()
export class UserService {
    async findUserByName(name: string) {
        return User.findOne({ where: { name: name } });
    }
    async findUserById(id: number) {
        return User.findOne({ where: { id: id } });
    }
    async createNewUser(name: string, password: string) {
        return User.create({ name: name, password: password });
    }
}