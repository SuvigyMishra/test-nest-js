export class ParsedFileBody {
  sheets?: number[] | number;
  sheetOptions?: SheetOptions[] = [];
}

export class SheetOptions {
  name?: string;
  headerLabels?: string[];

  startingRow?: number[] | number = 1;
  endingRow?: number[] | number = -1;
  omitRow?: number[] | number = -1;

  omitColumns?: number[] | number = -1;

  validations?: any;
}
