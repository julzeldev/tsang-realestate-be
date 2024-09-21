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
  destinationURL: string;

  @Prop({ enum: ScrapeStatus, default: ScrapeStatus.None })
  lastScrapeStatus: ScrapeStatus;

  @Prop({ type: MongooseSchema.Types.Mixed })
  information: any;
}

export const ScrapedPropertySchema =
  SchemaFactory.createForClass(ScrapedProperty);

ScrapedPropertySchema.index({ title: 1, destinationURL: 1 });
