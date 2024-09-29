import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum ScrapeStatus {
  Success = 'success',
  Failed = 'failed',
  None = 'none',
}

export type ScrapedPropertyDocument = ScrapedProperty & Document;

@Schema({ versionKey: false, timestamps: true })
export class ScrapedProperty extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  apartmentListUrl: string;

  @Prop({ enum: ScrapeStatus, default: ScrapeStatus.None })
  lastScrapeStatus: ScrapeStatus;

  @Prop({ type: MongooseSchema.Types.Mixed })
  information: any;

  // New fields for scraping log
  @Prop({ default: 0 })
  totalProperties: number;

  @Prop({ type: Date, default: Date.now })
  lastScrapedDate: Date;
}

export const ScrapedPropertySchema =
  SchemaFactory.createForClass(ScrapedProperty);

// Adding an index for efficient querying by title and apartmentListUrl
ScrapedPropertySchema.index({ title: 1, apartmentListUrl: 1 });
