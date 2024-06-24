import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { StorageGateway } from './storage.gateway';

@UseGuards(AuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService,
    private readonly storageGateway: StorageGateway) { }

  @Get('list/*')
  async listing(@AuthUser() user, @Param('0') file: string) {
    return this.storageService.listFiles(`storages/${user.id}`, file);
  }

  @Post('create/*')
  async mkdir(@AuthUser() user, @Param('0') file: string) {
    this.storageService.createDirectory(`storages/${user.id}`, file)
    this.storageGateway.sendAll(user.id, { type: "create", file: file });
  }

  @Post('upload/*')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@AuthUser() user, @Param('0') fileName: string, @UploadedFile() file) {
    this.storageService.createFile(`storages/${user.id}`, fileName, file.buffer);
    this.storageGateway.sendAll(user.id, { type: "upload", file: fileName });
  }

  @Get('download/*')
  async download(@AuthUser() user, @Param('0') fileName: string) {
    let data = await this.storageService.readFile(`storages/${user.id}`, fileName);
    this.storageGateway.sendAll(user.id, { type: "download", file: fileName });
    return Array.from(data);
  }

  @Delete('remove/*')
  async remove(@AuthUser() user, @Param('0') fileName: string) {
    this.storageService.delete(`storages/${user.id}`, fileName);
    this.storageGateway.sendAll(user.id, { type: "remove", file: fileName });
  }

  @Patch('append/*')
  async append(@AuthUser() user, @Param('0') fileName: string, @Body() content: string) {
    this.storageService.writeFile(`storages/${user.id}`, fileName, content);
    this.storageGateway.sendAll(user.id, { type: "append", file: fileName });
  }
}
