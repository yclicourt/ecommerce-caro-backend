import { CategoryName } from 'src/features/categories/enums/category-name.enum';
import { UpdateProductDto } from '../dto/update-product.dto';

export type UpdateProductPayload = Omit<UpdateProductDto, 'categories'> & {
  image?: string;
  categories?: Array<{ name: CategoryName; description?: string }>;
};
