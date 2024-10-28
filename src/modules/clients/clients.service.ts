import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
  ) {}

  /**
   * Retrieve all clients from the database.
   */
  async findAll(): Promise<Client[]> {
    try {
      return await this.clientModel.find().exec();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new BadRequestException('Unable to retrieve clients.');
    }
  }

  /**
   * Find a client by ID.
   * @param id - Client ID
   */
  async findOneById(id: string): Promise<Client> {
    try {
      const client = await this.clientModel.findById(id).exec();
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
      return client;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }

  /**
   * Create a new client.
   * @param createClientDto - Data transfer object containing client details
   */
  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const newClient = new this.clientModel(createClientDto);
      return await newClient.save();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new BadRequestException(
        'Error creating client. Please check the provided data.',
      );
    }
  }

  /**
   * Update a client by ID.
   * @param id - Client ID
   * @param updateClientDto - Data transfer object containing updated client details
   */
  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    try {
      const updatedClient = await this.clientModel
        .findByIdAndUpdate(id, updateClientDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedClient) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }

      return updatedClient;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new BadRequestException(
        'Error updating client. Please check the provided data.',
      );
    }
  }

  /**
   * Delete a client by ID.
   * @param id - Client ID
   */
  async delete(id: string): Promise<void> {
    try {
      const client = await this.clientModel.findByIdAndDelete(id).exec();
      if (!client) {
        throw new NotFoundException(`Client with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new BadRequestException('Error deleting client.');
    }
  }

  /**
   * Find clients by filtering with certain criteria (optional).
   * @param filter - Partial filter object for client properties
   */
  async findByFilter(filter: Partial<Client>): Promise<Client[]> {
    try {
      return await this.clientModel.find(filter).exec();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw new BadRequestException(
        'Error retrieving clients with specified filters.',
      );
    }
  }
}
