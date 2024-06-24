import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { join } from 'path';

@Injectable()
export class StorageService {
  private uri: string;

  constructor(private configService: ConfigService) {
    this.uri = configService.get<string>('HDFS_SERVER');
  }

  async createFile(root: string, path: string, content?: string) {
      const targetUrl = new URL(join(root, path), this.uri).toString();
      const response = await axios.put(targetUrl, null, {
        params: {
          op: 'CREATE',
          noredirect: true
        }
      });
      const { data } = await axios.put(response.data.Location, content);
      return data
  }
  async createDirectory(root: string, path: string) {
    const targetUrl = new URL(join(root, path), this.uri).toString();
    const { data } = await axios.put(targetUrl, null, {
      params: {
        op: 'MKDIRS',
      }
    });
    return data;
  }
  async delete(root: string, path: string) {
    try {
      const targetUrl = new URL(join(root, path), this.uri).toString();
      const { data } = await axios.delete(targetUrl, {
        params: {
          op: 'DELETE',
          recursive: true
        }
      });
      return data;
    }
    catch (err) {
      console.log(err)
    }
  }
  async readFile(root: string, path: string) {
    const targetUrl = new URL(join(root, path), this.uri).toString();
    const { data } = await axios.get(targetUrl, {
      responseType: 'arraybuffer',
      params: {
        op: 'OPEN',
      },
    });
    return data;
  }

  async listFiles(root: string, path: string) {
    const targetUrl = new URL(join(root, path), this.uri).toString();
    const { data } = await axios.get(targetUrl, {
      params: {
        op: 'LISTSTATUS',
        noredirect: true
      }
    });
    return data.FileStatuses.FileStatus;
  }

  async move(root: string, oldPath: string, newPath: string) {
    const targetUrl = new URL(join(root, oldPath), this.uri).toString();
    return await axios.put(targetUrl, null, {
      params: {
        op: 'RENAME',
        destination: join('/', root, newPath)
      }
    });
  }

  async getInfo(root: string, path: string) {
    const targetUrl = new URL(join(root, path), this.uri).toString();
    const response = await axios.get(targetUrl, {
      params: {
        op: 'GETFILESTATUS',
      }
    });
    return response.data;
  }
  async writeFile(root: string, path: string, content: string) {
    const targetUrl = new URL(join(root, path), this.uri).toString();
    const response = await axios.post(targetUrl, null, {
      params: {
        op: 'APPEND',
        'user.name': 'root',
        noredirect: true
      }
    });
    return await axios.post(response.data.Location, content)
  }
}
