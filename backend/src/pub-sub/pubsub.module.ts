import { Module } from '@nestjs/common';
import { PUB_SUB, pubSub } from './pubsub.provider';

@Module({
  providers: [{ provide: PUB_SUB, useValue: pubSub }],
  exports: [{ provide: PUB_SUB, useValue: pubSub }],
})
export class PubSubModule {}
