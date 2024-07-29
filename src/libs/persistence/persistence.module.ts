import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import dbconfig from './db.config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof dbconfig>) => {
    const { user, password, cluster, name } = configService.db;
    const uriDb = `mongodb+srv://${user}:${password}@${cluster}.mongodb.net/${name}?retryWrites=true&w=majority&appName=Cluster0`;
    console.log('MongoDB URI:', uriDb); // Para depuración
    return {
      uri: uriDb,
    };
  },
  
      inject: [dbconfig.KEY],
    }),
  ],
})
export class PersistenceModule {}



  