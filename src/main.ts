import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createApp } from './commons/createApp';
import { createWriteStream } from 'fs';
import { get } from 'http';

const PORT = process.env.PORT || 3000;
const serverUrl = 'http://localhost:3000';

async function start(): Promise<void> {
  const rawApp = await NestFactory.create(AppModule, {
    rawBody: true,
    cors: {
      origin: [
        'https://instagram-ui-nine.vercel.app/',
        'http://localhost:3000',
      ],
      credentials: true,
    },
  });
  const app = createApp(rawApp);
  await app.listen(PORT, () => {
    console.log(`[nest main] -> server started on http://localhost:${PORT}`);
  });
  if (process.env.NODE_ENV === 'development') {
    console.log('DEVELOP', process.env.NODE_ENV);
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });
    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });
    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        console.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}

start();
