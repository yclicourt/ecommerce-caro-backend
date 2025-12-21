import { Category } from 'src/features/categories/entities/category.entity';

export class Product {
  id: number;

  name: string;

  description?: string;

  price: number;

  image?: string;

  categories: Category[];
}
