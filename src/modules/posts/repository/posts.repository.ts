import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePostDto } from '../dto/createPost.dto';
import { randomUUID } from 'crypto';
import { Posts } from '@prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(
    description: string,
    userId: string,
    postPhoto: string,
  ): Promise<Posts> {
    return this.prisma.posts.create({
      data: {
        id: randomUUID(),
        description,
        postPhoto,
        user: { connect: { id: userId } },
      },
    });
  }
}
