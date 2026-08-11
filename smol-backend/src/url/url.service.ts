import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
  ) { }

  async createUrl(userId: string, createUrlDto: CreateUrlDto) {
    let { title, url } = createUrlDto;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (!title || title.trim() === '') {
      try {
        const parsed = new URL(formattedUrl);
        title = parsed.hostname.replace(/^www\./, '');
      } catch {
        title = 'Smol Link';
      }
    }

    const shortCode = await this.generateUniqueShortCode();

    const newUrl = await this.urlModel.create({
      title,
      userId: new Types.ObjectId(userId),
      url: formattedUrl,
      shortCode,
    });

    return this.formatUrlResponse(newUrl);
  }

  async findAllUserUrls(userId: string, search?: string) {
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { url: searchRegex }];
    }

    const urls = await this.urlModel.find(filter).sort({ createdAt: -1 }).exec();
    return urls.map((urlDoc) => this.formatUrlResponse(urlDoc));
  }

  async updateUrlTitle(userId: string, id: string, updateUrlDto: UpdateUrlDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('URL not found');
    }

    const urlDoc = await this.urlModel.findById(id);
    if (!urlDoc) {
      throw new NotFoundException('URL not found');
    }

    if (urlDoc.userId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to edit this URL');
    }

    urlDoc.title = updateUrlDto.title;
    await urlDoc.save();

    return this.formatUrlResponse(urlDoc);
  }

  async deleteUrl(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('URL not found');
    }

    const urlDoc = await this.urlModel.findById(id);
    if (!urlDoc) {
      throw new NotFoundException('URL not found');
    }

    if (urlDoc.userId.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this URL');
    }

    await this.urlModel.findByIdAndDelete(id);
    return { message: 'URL deleted successfully' };
  }

  async findByShortCode(shortCode: string): Promise<string> {
    const urlDoc = await this.urlModel.findOne({ shortCode });
    if (!urlDoc) {
      throw new NotFoundException('Short URL not found');
    }
    return urlDoc.url;
  }

  private async generateUniqueShortCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 6;
    let attempts = 0;

    while (attempts < 10) {
      let shortCode = 's_';
      for (let i = 0; i < length; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const exists = await this.urlModel.exists({ shortCode });
      if (!exists) {
        return shortCode;
      }
      attempts++;
    }

    // Fallback if 6 chars collided multiple times
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  }

  private formatUrlResponse(urlDoc: UrlDocument) {
    return {
      id: urlDoc._id.toString(),
      title: urlDoc.title,
      url: urlDoc.url,
      shortCode: urlDoc.shortCode,
      createdAt: (urlDoc as any).createdAt,
      updatedAt: (urlDoc as any).updatedAt,
    };
  }
}
