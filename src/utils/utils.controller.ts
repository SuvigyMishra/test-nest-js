import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as excelToJson from 'convert-excel-to-json';
import { unflatten } from 'flat';

import { UtilsService } from './utils.service';
import { FilteredFileDto } from './dto/filtered-file.dto';

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
    @UploadedFile() file: Express.Multer.File,
  ): object {
    if (!file || request.fileValidationError) {
      throw new BadRequestException(
        request.fileValidationError || 'No file uploaded',
      );
    }

    const result = excelToJson({
      source: file.buffer,
      header: { rows: 1 },
      columnToKey: {
        '*': '{{columnHeader}}',
      },
    });

    return {
      message: 'Parsed Data',
      data: unflatten(result),
    };
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
