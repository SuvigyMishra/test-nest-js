import { Injectable } from '@nestjs/common';
import e from 'express';
import { unflatten } from 'flat';
import * as XLSX from 'xlsx';

import { ParsedFileBody, SheetOptions } from './dto/parse-file-body.dto';

@Injectable()
export class UtilsService {
  parseFile(config: ParsedFileBody, workbook: XLSX.WorkBook) {
    const parsedJSON = {};

    for (const sheet in workbook.Sheets) {
      const sheetOptions: SheetOptions = config.sheetOptions?.find(
        (sheetOption) => sheetOption.name === sheet,
      );

      const parsedSheet: object[] = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet],
        { ...(sheetOptions.disableHeader && { header: 'A' }) },
      );

      if (parsedSheet.length === 0) {
        continue;
      }

      if (!!sheetOptions) {
        parsedJSON[sheet] = { valid: [], invalid: [] };

        for (const [index, row] of parsedSheet.entries()) {
          let rowValid = true;
          const formattedRow = {};

          if (
            sheetOptions.startingRow > index ||
            sheetOptions.endingRow < index ||
            sheetOptions.omitRow?.includes(index)
          ) {
            continue;
          }

          let columnIndex = 0;
          for (const column in row) {
            if (
              columnIndex < sheetOptions.startingColumn ||
              columnIndex > sheetOptions.endingColumn ||
              sheetOptions.omitColumns?.includes(columnIndex)
            ) {
              columnIndex++;
              continue;
            }

            let newColumnName = '';
            const columnLabel = sheetOptions.columnLabels?.find(
              (label) => label.from === column,
            );

            if (!!columnLabel) {
              newColumnName = columnLabel.to;
            } else {
              newColumnName = column;
            }

            const columnValidation = sheetOptions.validations?.find(
              (validation) => validation.for === column,
            );

            if (!!columnValidation) {
              if (
                columnValidation.type &&
                columnValidation.type !== typeof row[column]
              ) {
                rowValid = false;
              }

              if (
                columnValidation.minLength &&
                columnValidation.minLength < row[column].length
              ) {
                rowValid = false;
              }

              if (
                columnValidation.type &&
                columnValidation.maxLength > row[column].length
              ) {
                rowValid = false;
              }
            }

            formattedRow[newColumnName] = row[column];
          }

          parsedJSON[sheet][rowValid ? 'valid' : 'invalid'].push(formattedRow);
        }
      } else {
        parsedJSON[sheet] = parsedSheet;
      }
    }

    return {
      message: 'Parsed File',
      data: unflatten(parsedJSON),
    };
  }
}

class TypeMapping {
  int: number;
  number: number;

  character: string;
  string: string;
}
