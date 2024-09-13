import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property, PropertyDocument } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/properties-create.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  // Create a new property
  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const newProperty = new this.propertyModel(createPropertyDto);
    return newProperty.save();
  }

  // Find all properties
  async findAll(): Promise<Property[]> {
    return this.propertyModel.find().exec();
  }

  // Find a property by ID
  async findOne(id: string): Promise<Property> {
    return this.propertyModel.findById(id).exec();
  }

  // Update a property by ID
  async update(
    id: string,
    updatePropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    return this.propertyModel
      .findByIdAndUpdate(id, updatePropertyDto, { new: true })
      .exec();
  }

  // Delete a property by ID
  async delete(id: string): Promise<Property> {
    return this.propertyModel.findByIdAndDelete(id).exec();
  }
}
