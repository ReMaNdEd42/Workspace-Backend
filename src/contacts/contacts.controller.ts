import { Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ContactsService } from './contacts.service';
import { UserService } from 'src/user/user.service';

@UseGuards(AuthGuard)
@Controller('contacts')
export class ContactsController {

    constructor(private readonly contactsService: ContactsService,
        private readonly userService: UserService
    ) { }

    @Get()
    async getContactsByUserId(@AuthUser() authUser) {
        return await this.contactsService.findAllContacts(authUser.id);
    }

    @Post(':contactUserName')
    async addContactsByUserName(@AuthUser() authUser,
        @Param('contactUserName') contactUserName: string) {
        const contactUser = await this.userService.findUserByName(contactUserName);
        if (contactUser) {
            return await this.contactsService.addContact(authUser.id, contactUser.get().id);
        }
        else {
            throw new NotFoundException('Not found user to add contact');
        }
    }

    @Delete(':contactUserId')
    async removeContactsByUserId(@AuthUser() authUser,
        @Param('contactUserId', ParseIntPipe) contactUserId: number) {
        return await this.contactsService.removeContact(authUser.id, contactUserId);
    }
}
