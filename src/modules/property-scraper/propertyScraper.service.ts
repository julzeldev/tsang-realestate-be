// src/scraper/scraper.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Property,
  PropertyDocument,
} from '../properties/schemas/property.schema';
import {
  ScrapedProperty,
  ScrapedPropertyDocument,
  ScrapeStatus,
} from './schemas/scrapedProperty.schema';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { load } from 'cheerio';
import { CronJob, CronTime } from 'cron';

@Injectable()
export class PropertyScraperService {
  private readonly logger = new Logger(PropertyScraperService.name);
  private currentFrequency: string = CronExpression.EVERY_DAY_AT_MIDNIGHT; // Default frequency

  constructor(
    @InjectModel(Property.name)
    private propertyModel: Model<PropertyDocument>,
    @InjectModel(ScrapedProperty.name)
    private scrapedPropertyModel: Model<ScrapedPropertyDocument>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  private scraperJob: CronJob;

  /**
   * Handles the scheduled scraping task.
   * Runs at midnight every day.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'scraper',
  })
  handleCron() {
    this.logger.debug('Running scheduled scraping task');
    this.init();
  }

  /**
   * Initializes the scraping process.
   * Fetches all property list and processes each property.
   */
  async init() {
    try {
      const dataList = await this.fetchAllList();
      for (const property of dataList) {
        this.logger.log('Processing => ', property.apartmentListUrl);
        if (
          this.hostNameMatch(property.apartmentListUrl, 'apartmentlist.com')
        ) {
          await this.scrapeApartmentListPropertyByURL(
            property.apartmentListUrl,
          );
          this.logger.log('Finished Processing => ', property.apartmentListUrl);
          await this.delay(2000);
        } else {
          this.logger.log('Skipping => ', property.apartmentListUrl);
        }
      }
    } catch (error) {
      this.logger.error('Processing failed => ', error);
    }
  }

  /**
   * Fetches all property list from the database.
   * @returns A promise that resolves to an array of PropertyDocument.
   */
  async fetchAllList(): Promise<PropertyDocument[]> {
    try {
      const allList = await this.propertyModel
        .find({}, { title: 1, apartmentListUrl: 1 })
        .lean();
      return allList;
    } catch (error) {
      this.logger.error('Error while fetching all list data => ', error);
      return [];
    }
  }

  /**
   * Checks if the hostname of the given URL matches the specified hostname.
   * @param url - The URL to check.
   * @param hostName - The hostname to match.
   * @returns True if the hostname matches, false otherwise.
   */
  hostNameMatch(url: string, hostName: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.replace(/^www\./, '');
      return hostname === hostName;
    } catch (error) {
      this.logger.error('Invalid URL:', error);
      return false;
    }
  }

  /**
   * Scrapes the property information from the given URL.
   * @param url - The URL to scrape.
   */
  async scrapeApartmentListPropertyByURL(url: string): Promise<void> {
    try {
      const updatedInfo: any = {
        lastScrapeStatus: ScrapeStatus.None,
        lastScrapedDate: new Date(),
      };
      const { html, status } = await this.getPageHtml(url);
      if (status !== '200') {
        updatedInfo.lastScrapeStatus = ScrapeStatus.Failed;
      }
      const scriptData = this.extractScriptById(html);
      const propertyInformation = this.extractPropertyInformation(scriptData);
      if (propertyInformation === null) {
        updatedInfo.lastScrapeStatus = ScrapeStatus.Failed;
      }
      updatedInfo.lastScrapeStatus = ScrapeStatus.Success;
      Object.assign(updatedInfo, { information: propertyInformation });
      await this.scrapedPropertyModel.findOneAndUpdate(
        { apartmentListUrl: url },
        updatedInfo,
        { upsert: true, new: true },
      );
    } catch (error) {
      this.logger.error(
        `Failed to scrape ApartmentList URL => ${url} => `,
        error,
      );
    }
  }

  /**
   * Fetches the HTML content of the given URL.
   * @param url - The URL to fetch.
   * @returns A promise that resolves to an object containing the HTML content and the status code.
   */
  async getPageHtml(url: string): Promise<{ html: string; status: string }> {
    try {
      const cookieValue = 'geofence_bypass=true';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          cookie: cookieValue,
          Referer: `${url}`,
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      });
      return {
        html: await response.text(),
        status: response.status.toString(),
      };
    } catch (error) {
      this.logger.error('Error fetching HTML:', error);
      throw error;
    }
  }

  /**
   * Extracts the content of a script element with the specified ID from the given HTML content.
   * @param pageHTMLContent - The HTML content.
   * @returns The content of the script element as a string.
   */
  extractScriptById(pageHTMLContent: string): string {
    const $ = load(pageHTMLContent);
    const scriptElement = $(`script#__NEXT_DATA__`);
    if (scriptElement.length > 0) {
      return scriptElement.html() || ``;
    } else {
      return ``;
    }
  }

  /**
   * Extracts the property information from the given JSON string.
   * @param jsonString - The JSON string.
   * @returns The extracted property information as an object, or null if extraction fails.
   */
  extractPropertyInformation(jsonString: string): any {
    try {
      const jsonData = JSON.parse(jsonString);
      return jsonData?.props?.pageProps?.component?.listing ?? null;
    } catch (error) {
      this.logger.error(`Failed process properties id from string`, error);
      return null;
    }
  }

  /**
   * Delays the execution for the specified number of milliseconds.
   * @param ms - The number of milliseconds to delay.
   * @returns A promise that resolves after the delay.
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Starts the scraper immediately.
   */
  async startScraper() {
    this.logger.debug('Starting scraper on demand');
    await this.init();
  }

  /**
   * Gets the scraping logs from the database.
   * @returns A promise that resolves to an array of scraping logs.
   */
  async getScrapingLogs(): Promise<any> {
    try {
      const logs = await this.scrapedPropertyModel
        .find(
          {},
          {
            apartmentListUrl: 1,
            lastScrapedDate: 1,
            lastScrapeStatus: 1,
          },
        )
        .lean();
      const frequency = this.currentFrequency;
      const lastScrapedDate = logs[0].lastScrapedDate;
      const totalProperties = logs.length;
      const successCount = logs.filter(
        (log) => log.lastScrapeStatus === ScrapeStatus.Success,
      ).length;
      return {
        frequency,
        lastScrapedDate,
        totalProperties,
        successCount,
      };
    } catch (error) {
      this.logger.error('Error while fetching scraping logs:', error);
      return [];
    }
  }

  /**
   * Updates the cron schedule for the scraper.
   * @param frequency - The cron expression for the new schedule.
   */
  updateCronSchedule(frequency: string) {
    const job = this.schedulerRegistry.getCronJob('scraper');
    job.setTime(new CronTime(frequency));
    job.start();
    this.currentFrequency = frequency;
    this.logger.debug(`Updated scraper schedule to: ${frequency}`);
    return { frequency };
  }
}
