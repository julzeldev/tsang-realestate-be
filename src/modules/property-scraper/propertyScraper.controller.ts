// src/scraper/scraper.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { PropertyScraperService } from './propertyScraper.service';

@Controller('property-scraper')
export class PropertyScraperController {
  constructor(private readonly scraperService: PropertyScraperService) {}

  @Post('start')
  async startScraper() {
    await this.scraperService.startScraper();
    return { message: 'Scraper started' };
  }

  @Post('schedule')
  async updateSchedule(@Body('frequency') frequency: string) {
    this.scraperService.updateCronSchedule(frequency);
    return { message: `Scraper schedule updated to: ${frequency}` };
  }
}
