import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  create(createInvoiceDto: CreateInvoiceDto) {
    return { message: 'Invoice created', data: {} };
  }

  findAll() {
    return { message: 'Invoice Data', data: [] };
  }

  findOne(id: number) {
    return { message: `Invoice Data with ID ${id}`, data: {} };
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return { message: `Invoice data for ${id} updated`, data: {} };
  }

  remove(id: number) {
    return { message: `Invoice ${id} removed` };
  }
}
