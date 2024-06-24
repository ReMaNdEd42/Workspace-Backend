import { Injectable } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { ScheduleService } from 'src/automation/schedule.service';
import { GptService } from 'src/gpt/gpt.service';

@Injectable()
export class AutomationService {

    constructor(private readonly storageService: StorageService,
        private readonly scheduleService: ScheduleService,
        private readonly gptService: GptService) { }

    async createInstr(userId: number, name: string, instruction: string) {
        return await this.storageService.createFile('automation', `${userId}/${name}`, instruction);
    }

    async generateInstr(userId: number, name: string, description: string) {
        await this.storageService.createFile('automation', `${userId}/${name}`);
        const instruction = await this.gptService.askGpt(description);
        await this.storageService.writeFile('automation', `${userId}/${name}`, instruction);
    }

    async removeInstr(userId: number, name: string) {
        return await this.storageService.delete('automation', `${userId}/${name}`);
    }

    async readInstr(userId: number, name: string) {
        let encoded = await this.storageService.readFile('automation', `${userId}/${name}`);
        return new TextDecoder().decode(encoded);
    }

    async listOfInstrs(userId: number) {
        let list = await this.storageService.listFiles('automation', `${userId}`);
        let res: Array<any> = list.map((instr) => {
            return {
                name: instr.pathSuffix,
                status: false
            }
        });
        let listOfActive = await this.scheduleService.list(userId);
        listOfActive.forEach(active => {
            let resIt = res.find((e) => e.name == active.name);
            if (resIt) {
                resIt.status = true;
            }
        })
        return res;
    }

    async updateInstr(userId: number, name: string, instruction: string) {
        await this.removeInstr(userId, name);
        return await this.createInstr(userId, name, instruction);
    }


    async setStatus(userId: number, name: string, status: boolean) {
        let instrs = await this.listOfInstrs(userId);
        let instr = instrs.find(instr => instr.name == name);
        if (instr) {
            if (status) {
                let code = await this.readInstr(userId, instr.name);
                this.scheduleService.run(userId, instr.name, code);
            }
            else {
                this.scheduleService.stop(userId, name);
            }
        }
    }
}
