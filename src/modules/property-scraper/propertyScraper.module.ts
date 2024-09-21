// src/scraper/scraper.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { PropertyScraperService } from './propertyScraper.service';
import { PropertyScraperController } from './propertyScraper.controller';
import {
  Property,
  PropertySchema,
} from '../properties/schemas/property.schema';
import {
  ScrapedProperty,
  ScrapedPropertySchema,
} from './schemas/scrapedProperty.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
      { name: ScrapedProperty.name, schema: ScrapedPropertySchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [PropertyScraperController],
  providers: [PropertyScraperService],
})
export class PropertyScraperModule {}
