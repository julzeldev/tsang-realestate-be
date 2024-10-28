import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
class Preferences {
  @Prop({ type: String, default: '' })
  area?: string;

  @Prop({ type: [String], default: [] })
  zipCodes?: string[];

  @Prop({ type: Number, min: 0, default: 0 })
  beds?: number;

  @Prop({ type: Number, min: 0, default: 0 })
  baths?: number;

  @Prop({ type: Boolean, default: false })
  washerDryerConnections?: boolean;

  @Prop({ type: Boolean, default: false })
  washerDryerIncluded?: boolean;

  @Prop({ type: Boolean, default: false })
  hasBalconyPatio?: boolean;

  @Prop({ type: Boolean, default: false })
  noCarpetInLiving?: boolean;

  @Prop({ type: Boolean, default: false })
  yard?: boolean;

  @Prop({ type: Number, min: 0, default: 0 })
  priceMin?: number;

  @Prop({ type: Number, min: 0, default: 0 })
  priceMax?: number;

  @Prop({ type: Date })
  earliestMoveIn?: Date;

  @Prop({ type: Date })
  latestMoveIn?: Date;
}

@Schema({ timestamps: true })
class Contact {
  @Prop({ required: true, unique: true, match: /.+\@.+\..+/ })
  email: string;

  @Prop({ match: /^[0-9]{10,15}$/ })
  phoneNumber?: string;

  @Prop()
  instagram?: string;
}

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: Contact, required: true })
  contact: Contact;

  @Prop({ type: Preferences, required: true })
  preferences: Preferences;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
