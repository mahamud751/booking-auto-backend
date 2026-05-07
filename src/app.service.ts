import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      service: 'f-commerce-toolkit-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
