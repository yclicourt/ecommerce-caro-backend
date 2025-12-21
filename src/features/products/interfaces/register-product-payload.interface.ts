import { CategoryName } from 'src/features/categories/enums/category-name.enum';
import { CreateProductDto } from '../dto/create-product.dto';

export type RegisterProductPayload = Omit<CreateProductDto, 'categories'> & {
  image?: string;
  categories?: Array<{ name: CategoryName; description?: string }>;
};
