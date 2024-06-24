import { Body, ConflictException, Controller, Get, HttpCode, Post, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { RegistrationDto } from './dto/registration.dto';
import { AuthConstants } from './auth.constants';
import { StorageService } from 'src/storage/storage.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService,
        private readonly storageService: StorageService
    ) { }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() loginDto: LoginDto) {
        const user = await this.userService.findUserByName(loginDto.username);
        if (user) {
            const isCorrectPassword = (loginDto.password == user.getDataValue("password"));
            if (isCorrectPassword) {
                return sign(
                    { id: user.get('id') },
                    loginDto.password, { expiresIn: "10h" }
                );
            }
            else {
                throw new UnauthorizedException(AuthConstants.WRONG_PASSWORD)
            }
        }
        else {
            throw new UnauthorizedException(AuthConstants.USER_NOT_FOUND)
        }
    }

    @Post('registration')
    @UsePipes(new ValidationPipe())
    async registration(@Body() registrationDto: RegistrationDto) {
        let user = await this.userService.findUserByName(registrationDto.username);
        if (user) {
            throw new ConflictException(AuthConstants.ALREADY_REGISTERED)
        } else {
            user = await this.userService.createNewUser(
                registrationDto.username,
                registrationDto.password
            )
            await this.storageService.createDirectory('storages', user.get().id.toString());
            await this.storageService.createDirectory('calendar', user.get().id.toString());
            await this.storageService.createDirectory('automation', user.get().id.toString());
            return user.get();
        }
    }
    @UseGuards(AuthGuard)
    @Get('whoAmi')
    async whoAmi(@AuthUser() user){
        delete user.password;
        return user;
    }
}
