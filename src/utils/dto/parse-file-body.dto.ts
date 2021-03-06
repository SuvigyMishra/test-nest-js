export class ParsedFileBody {
  sheets: number[];
  sheetOptions: SheetOptions[];
}

export interface SheetOptions {
  name: string;

  disableHeader: boolean;

  startingRow: number;
  endingRow: number;
  omitRow: number[];

  columnLabels: ColumnLabels[];
  startingColumn: number;
  endingColumn: number;
  omitColumns: number[];

  validations: ColumnValidations[];
}

export interface ColumnLabels {
  from: string;
  to: string;
}

export interface ColumnValidations {
  for: string;
  type: string;
  maxLength: number;
  minLength: number;
}
