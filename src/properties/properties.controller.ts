import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { validateOrReject } from 'class-validator';
import { parse } from 'csv-parse';
import * as multer from 'multer';
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

  // Upload CSV and process it
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Store the file in memory
      fileFilter: (req, file, callback) => {
        // Ensure the uploaded file is a CSV
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(
            new BadRequestException('Only CSV files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed');
    }

    const fileContent = file.buffer.toString('utf8'); // Ensure encoding is correct

    // Parse and process the CSV data
    const records = await this.parseCsv(fileContent);
    const results = [];
    const errors = [];

    for (const record of records) {
      try {
        // Map CSV data to CreatePropertyDto
        const propertyDto = new CreatePropertyDto();
        propertyDto.name = record['Name of Property'];
        propertyDto.apartmentListUrl = record['Apartment List URL'];
        propertyDto.multimediaPath = record['Multimedia Path'] || null;
        propertyDto.propertyEmail = record['Property Email'];
        propertyDto.typeOfBuilding = record['Type of Building'];
        propertyDto.status = record['Property Status'] || null;

        // Validate the DTO
        await validateOrReject(propertyDto);

        // Add or update property in the DB
        results.push(
          await this.propertiesService.addOrUpdateProperty(propertyDto),
        );
      } catch (error) {
        // Capture errors for this record
        errors.push({
          record,
          error: error instanceof Array ? error : [error.message],
        });
      }
    }

    if (errors.length > 0) {
      return {
        message: 'Upload completed with some errors',
        results,
        errors,
      };
    }

    return { message: 'Upload completed successfully', results };
  }

  // Helper function to parse the CSV file
  async parseCsv(csvData: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      parse(csvData, { columns: true }, (err, parsedRecords) => {
        if (err) {
          return reject(err);
        }
        resolve(parsedRecords); // Use parsedRecords directly
      });
    });
  }
}
