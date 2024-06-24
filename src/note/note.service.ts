import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class NoteService {

    constructor(private readonly storageService: StorageService) { }

    async create(userId: number, name: string, note: string) {
        return await this.storageService.createFile('notes', `${userId}/${name}`, note);
    }

    async remove(userId: number, name: string) {
        return await this.storageService.delete('notes', `${userId}/${name}`);
    }

    async read(userId: number, name: string) {
        let encoded = await this.storageService.readFile('notes', `${userId}/${name}`);
        let json = new TextDecoder().decode(encoded);
        return JSON.parse(json);
    }

    async listOf(userId: number) {
        let list = await this.storageService.listFiles('notes', `${userId}`);
        let res: Array<any> = list.map((instr) => {
            return {
                name: instr.pathSuffix,
            }
        });
        return res;
    }

    async update(userId: number, name: string, note: string) {
        await this.remove(userId, name);
        return await this.create(userId, name, note);
    }

}
