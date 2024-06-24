import { Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) { }
    
    @Get(":userId")
    async userInfoById(@Param('userId', ParseIntPipe) userId: number) {
        return await this.userService.findUserById(userId);
    }
}
