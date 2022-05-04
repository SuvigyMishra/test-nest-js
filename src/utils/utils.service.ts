import { Injectable } from '@nestjs/common';
import { unflatten } from 'flat';
import * as XLSX from 'xlsx';

import { ParsedFileBody, SheetOptions } from './dto/parse-file-body.dto';

@Injectable()
export class UtilsService {
  parseFile(config: ParsedFileBody, workbook: XLSX.WorkBook) {
    const parsedJSON = {};

    for (const sheet of workbook.SheetNames) {
      const parsedSheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

      if (parsedSheet.length === 0) {
        continue;
      }

      const sheetOptions: SheetOptions = config.sheetOptions.find(
        (sheetOption) => sheetOption.name === sheet,
      );

      const finalSheet = [];

      if (!!sheetOptions) {
        for (const [index, row] of parsedSheet.entries()) {
          if (
            sheetOptions.startingRow > index ||
            sheetOptions.endingRow < index ||
            sheetOptions.omitRow === index
          ) {
            continue;
          }

          finalSheet.push(row);
        }
      }

      if (finalSheet.length === 0) {
        continue;
      }

      parsedJSON[sheet] = finalSheet;

      console.log(`%c[dh]`, 'font-weight: bold; color: red', sheet);
      console.log(
        `%c[parsedSheet]`,
        'font-weight: bold; color: red',
        parsedSheet,
      );
    }

    return {
      message: 'Parsed File',
      data: parsedJSON,
      // data: unflatten(parsedJSON), // Fix sometime flatten not working
    };
  }
}
