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
import { ParsedFileBody } from './dto/parse-file-body.dto';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Post('file-parser')
  @UseInterceptors(FileInterceptor('file'))
  parseFile(
    @Body() config: any,
    @UploadedFile() file: Express.Multer.File,
  ): object {
    if (!file) {
      throw new BadRequestException('Please upload a file for parsing.');
    }

    if (!file.originalname.match(/.(csv|xls|xlsx)$/)) {
      throw new BadRequestException('Please upload a supported file.');
    }

    const workbook = XLSX.read(file.buffer, { sheets: config.sheets });

    return this.utilsService.parseFile(configParser(config), workbook);
  }
}

function configParser(config): ParsedFileBody {
  return {
    ...(config.sheets && {
      sheets:
        typeof config.sheets === 'string'
          ? JSON.parse(config.sheets)
          : config.sheets,
    }),
    ...(config.sheetOptions && {
      sheetOptions:
        typeof config.sheetOptions === 'string'
          ? JSON.parse(config.sheetOptions)
          : config.sheetOptions,
    }),
  };
}
