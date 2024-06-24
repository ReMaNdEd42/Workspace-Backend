import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact, ContactStatus } from './contacts.model';
import { User } from 'src/user/user.model';

@Injectable()
export class ContactsService {
    async findAllContacts(userId: number) {
        let contacts = await Contact.findAll({ where: { userId: userId } });
        return await Promise.all(contacts.map(async (contact) => {
            const user = await User.findOne({ where: { id: contact.get().contactUserId } });
            if (user) {
                return {
                    id: user.get().id,
                    name: user.get().name,
                }
            }
        }));
    }

    async addContact(userId: number, contactUserId: number) {

        const existingContact = await Contact.findOne({
            where:
            {
                userId: userId,
                contactUserId: contactUserId,
            }
        })
        if (!existingContact) {
            return Contact.create({
                userId: userId,
                contactUserId: contactUserId,
                status: ContactStatus.AVAILABLE
            });
        }
        else {
            throw new NotFoundException('Contact already exists');
        }
    }

    async removeContact(userId: number, contactUserId: number) {
        let isDeleted = await Contact.destroy({
            where: {
                contactUserId: contactUserId,
                userId: userId,
            }
        })
        if (!isDeleted) {
            throw new NotFoundException('Contact not found');
        }
    }
}