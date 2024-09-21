import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema()
export class Property {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  apartmentListUrl: string;

  @Prop()
  multimediaPath?: string;

  @Prop({ required: true })
  propertyEmail: string;

  @Prop({ required: true })
  typeOfBuilding: string;

  @Prop()
  status?: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
