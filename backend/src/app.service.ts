import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOverview() {
    return {
      name: 'ScaleLab API',
      version: '0.1.0',
      status: 'ok',
      modules: ['systems', 'simulation', 'metrics'],
    };
  }
}
