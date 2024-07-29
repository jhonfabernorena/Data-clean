import { Module } from "@nestjs/common";
import { PersistenceModule } from './libs/persistence/persistence.module';
import db_config from './libs/persistence/db.config';
import {ConfigModule} from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [db_config],
      isGlobal: true,
    }),
    PersistenceModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
