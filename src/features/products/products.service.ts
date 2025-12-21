import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CategoryName } from 'generated/prisma/enums';
import { UpdateProductPayload } from './interfaces/update-product-payload.interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Method to create a new product
  createProductItem(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: parseFloat(createProductDto.price),
        image: createProductDto.image,
      },
    });
  }

  // Method to get all product items
  async getAllProductItems() {
    const productFounds = await this.prisma.product.findMany({
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
    });
    return productFounds;
  }

  // Method to get a single product item by ID
  async getProductItem(id: number) {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
      },
    });
  }

  // Method to update product item
  async updateProductItem(
    id: number,
    updateProductPayload: UpdateProductPayload,
  ) {
    const productFound = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
      },
    });
    if (!productFound) throw new HttpException('Product not found', 404);
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        name: updateProductPayload.name,
        description: updateProductPayload.description,
        price: Number(updateProductPayload.price),
        image: updateProductPayload.image,
        categories: Array.isArray(updateProductPayload.categories)
          ? {
              deleteMany: {},
              create: (
                updateProductPayload.categories as Array<{
                  name: CategoryName;
                  description?: string;
                }>
              ).map((cat) => ({
                name: cat.name,
                description: cat.description || null,
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
    });
  }

 // Method to delete product item
  async deleteProductItem(id: number) {
    try {
      const productFound = await this.getProductItem(id);

      if (!productFound) throw new HttpException('Product not Found', 404);

      return await this.prisma.product.delete({
        where: {
          id,
        },
      });
    } catch (err: unknown) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2003') {
          throw new ConflictException('The Field dont not exist in the table');
        }
      }
      throw err;
    }
  }
}
