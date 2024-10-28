import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { Client } from './schemas/client.schema';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Client> {
    const client = await this.clientsService.findOneById(id);
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
  }

  @Get('filter')
  async findByFilter(@Query() filter: Partial<Client>): Promise<Client[]> {
    try {
      return this.clientsService.findByFilter(filter);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new BadRequestException('Invalid filter criteria.');
    }
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const updatedClient = await this.clientsService.update(id, updateClientDto);
    if (!updatedClient) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return updatedClient;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.clientsService.delete(id);
  }
}
