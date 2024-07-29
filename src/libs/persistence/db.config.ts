import { registerAs } from '@nestjs/config';

export default registerAs('dbConfig', () => {
  const dbConfig = {
    db: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      cluster: process.env.DB_CLUSTER,
      name: process.env.DB_NAME, // Asegúrate de definir esto en el archivo .env
    },
    env: process.env.NODE_ENV || 'local',
  };
  return dbConfig;
});
