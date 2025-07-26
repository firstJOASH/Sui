// posts.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './entities/post.entity';
import { EventSchema } from 'src/events/schemas/event.schema';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema },{ name: Event.name, schema: EventSchema },{ name: User.name, schema: UserSchema }]),
    UsersModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService] 
})
export class PostsModule {}
