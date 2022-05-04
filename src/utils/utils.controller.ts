import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

import { UtilsService } from './utils.service';
import { FilteredFileDto } from './dto/filtered-file.dto';
import { ParsedFileBody } from './dto/parse-file-body.dto';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Post('file-parser')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
    }),
  )
  parseFile(
    @Req() request: any,
    @Body() config: ParsedFileBody,
    @UploadedFile() file: Express.Multer.File,
  ): object {
    if (!file || request.fileValidationError) {
      throw new BadRequestException(
        request.fileValidationError || 'No file uploaded',
      );
    }

    const workbook = XLSX.read(file.buffer, { sheets: config.sheets });

    return this.utilsService.parseFile(config, workbook);
  }
}

function fileFilter(request: any, file: FilteredFileDto, cb) {
  if (!file.originalname.match(/.(csv|xls|xlsx)$/)) {
    request.fileValidationError =
      'Invalid file uploaded. Please upload a supported file';

    return cb(null, false);
  }

  return cb(null, true);
}
