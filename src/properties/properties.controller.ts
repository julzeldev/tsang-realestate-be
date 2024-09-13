import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/properties-create.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  // Create a new property
  @Post()
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  // Get all properties
  @Get()
  async findAll() {
    return this.propertiesService.findAll();
  }

  // Get a single property by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  // Update a property by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: CreatePropertyDto,
  ) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  // Delete a property by ID
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.propertiesService.delete(id);
  }
}
