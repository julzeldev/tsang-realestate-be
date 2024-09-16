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

  // Add or update a property based on a unique field (e.g., apartmentListUrl)
  async addOrUpdateProperty(
    createPropertyDto: CreatePropertyDto,
  ): Promise<Property> {
    // Check if a property already exists based on the unique field apartmentListUrl
    const existingProperty = await this.propertyModel.findOne({
      apartmentListUrl: createPropertyDto.apartmentListUrl,
    });

    if (existingProperty) {
      // If the property exists, update it
      return this.propertyModel
        .findOneAndUpdate({ _id: existingProperty._id }, createPropertyDto, {
          new: true,
        })
        .exec();
    } else {
      // If the property does not exist, create a new one
      const newProperty = new this.propertyModel(createPropertyDto);
      return newProperty.save();
    }
  }

  // Create a new property (no update logic, just for manual creation)
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
