import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { JwtAuthGuard } from '../user/guards/jwt.guard';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('url')
  @UseGuards(JwtAuthGuard)
  async createUrl(
    @Req() req: any,
    @Body() createUrlDto: CreateUrlDto,
  ) {
    const data = await this.urlService.createUrl(req.user.userId, createUrlDto);
    return {
      message: 'Short URL created successfully',
      data,
    };
  }

  @Get('urls')
  @UseGuards(JwtAuthGuard)
  async getUrls(
    @Req() req: any,
    @Query('search') search?: string,
  ) {
    const data = await this.urlService.findAllUserUrls(req.user.userId, search);
    return {
      message: 'URLs retrieved successfully',
      data,
    };
  }

  @Patch('url/:id')
  @UseGuards(JwtAuthGuard)
  async updateUrl(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    const data = await this.urlService.updateUrlTitle(
      req.user.userId,
      id,
      updateUrlDto,
    );
    return {
      message: 'URL title updated successfully',
      data,
    };
  }

  @Delete('url/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUrl(
    @Req() req: any,
    @Param('id') id: string,
  ) {
    const result = await this.urlService.deleteUrl(req.user.userId, id);
    return result;
  }

  @Get(':shortCode')
  async redirectToOriginalUrl(
    @Param('shortCode') shortCode: string,
    @Res() res: any,
  ) {
    const originalUrl = await this.urlService.findByShortCode(shortCode);
    return res.redirect(302, originalUrl);
  }
}
