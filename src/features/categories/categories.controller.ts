import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategryController(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategoryItem(createCategoryDto);
  }

  @Get()
  getAllCategoriesController() {
    return this.categoriesService.getAllCategoryItems();
  }

  @Get(':id')
  getCatgoryController(@Param('id',ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryItem(id);
  }

  @Patch(':id')
  updateCategoryController(@Param('id',ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategoryItem(id, updateCategoryDto);
  }

  @Delete(':id')
  deleteCategoryController(@Param('id',ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
