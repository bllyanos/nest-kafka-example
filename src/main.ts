import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { v4 } from "uuid";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    req.__id = v4();
    next();
  });

  await app.listen(3000);
}
bootstrap();
