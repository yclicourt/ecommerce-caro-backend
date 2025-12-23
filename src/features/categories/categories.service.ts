import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Method to create a new category item
  createCategoryItem(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        product: {
          connect: { id: createCategoryDto.productId },
        },
      },
    });
  }

  // Method to get all category items
  getAllCategoryItems() {
    return this.prisma.category.findMany({});
  }

  // Method to get categories by a product
  async getCategoryByProducts(productId: number) {
    const productFound = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!productFound) throw new HttpException('Product not found', 404);

    return await this.prisma.category.findMany({
      where: {
        id: productFound.id,
      },
    });
  }

  // Method to get a category item
  async getCategoryItem(id: number) {
    const categoryFound = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!categoryFound) throw new HttpException('Category not found', 400);

    return categoryFound;
  }

  // Method to update a category item
  async updateCategoryItem(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categoryFound = await this.getCategoryItem(id);

    if (!categoryFound) throw new HttpException('Category not found', 404);

    const categoryUpdated = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...updateCategoryDto,
      },
    });
    return categoryUpdated;
  }

  // Method to delete a category
  async deleteCategory(id: number) {
    const categoryFound = await this.getCategoryItem(id);

    if (!categoryFound) throw new HttpException('Category not found', 404);

    await this.prisma.category.delete({
      where: {
        id,
      },
    });

    return 'Category deleted successfully';
  }
}
