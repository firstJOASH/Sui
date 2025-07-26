import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  
  app.enableCors({
    origin: "*", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: false, 
  })

  
  app.setGlobalPrefix("api/v1")

  
  const config = new DocumentBuilder()
    .setTitle("NFTix API")
    .setDescription("NFT Event Ticketing API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)

  console.log(`🚀 NFTix Backend running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
