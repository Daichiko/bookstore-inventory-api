export class Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  costUsd: number;
  stockQuantity: number;
  category: string;
  supplierCountry: string;
  createdAt: Date;
  updatedAt: Date;

  sellingPriceLocal?: number | null;
}
