import { Injectable } from '@nestjs/common';
import { unflatten } from 'flat';
import * as XLSX from 'xlsx';

import { ParsedFileBody, SheetOptions } from './dto/parse-file-body.dto';

@Injectable()
export class UtilsService {
  parseFile(config: ParsedFileBody, workbook: XLSX.WorkBook) {
    console.log(`%c[c]`, 'font-weight: bold; color: red', config);
    const parsedJSON = {};

    for (const sheet in workbook.Sheets) {
      const parsedSheet: object[] = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheet],
      );

      if (parsedSheet.length === 0) {
        continue;
      }

      // TODO: Set correct config
      const sheetOptions: SheetOptions = config.sheetOptions.find(
        (sheetOption) => sheetOption.name === sheet,
      );

      // const sheetOptions: SheetOptions = {
      //   startingRow: 2,
      //   endingRow: 5,

      //   columnLabels: [
      //     {
      //       from: 'To-do List',
      //       to: 'col 1',
      //     },
      //     {
      //       from: ' age',
      //       to: 'Age',
      //     },
      //     {
      //       from: 'status',
      //       to: 'Status',
      //     },
      //   ],

      //   validations: [
      //     {
      //       for: ' age',
      //       validator: (age) => age > 50,
      //     },
      //   ],
      // };

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

            if (
              !!columnValidation &&
              !columnValidation.validator(row[column])
            ) {
              rowValid = false;
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
      data: unflatten(parsedJSON), // Fix sometime flatten not working
    };
  }
}
