import { DocumentBuilder } from "@nestjs/swagger";

export const config = new DocumentBuilder()
  .setTitle('Ecommerce Caro API')
  .setDescription('Ecommerce Caro API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
