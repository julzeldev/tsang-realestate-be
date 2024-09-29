import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PropertyScraperService } from './propertyScraper.service';

@Controller('property-scraper')
export class PropertyScraperController {
  constructor(private readonly scraperService: PropertyScraperService) {}

  @Post('start')
  async startScraper() {
    try {
      await this.scraperService.startScraper();
      return { message: 'Scraper started successfully' };
    } catch (error) {
      // Log the error and return an error response
      console.error('Error starting the scraper:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to start the scraper',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('schedule')
  async updateSchedule(@Body('frequency') frequency: string) {
    try {
      this.scraperService.updateCronSchedule(frequency);
      return { frequency };
    } catch (error) {
      // Log the error and return an error response
      console.error('Error updating the scraper schedule:', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to update scraper schedule',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('logs')
  async getScrapingLogs() {
    try {
      const logs = await this.scraperService.getScrapingLogs();
      return logs;
    } catch (error) {
      // Log the error and return an error response
      console.error('Error fetching scraping logs:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch scraping logs',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
