import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
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
  async updatePostById(postId: string, description: string): Promise<Posts> {
    return this.prisma.posts.update({
      where: { id: postId },
      data: { description },
    });
  }
  async findPostById(postId: string): Promise<Posts> {
    return this.prisma.posts.findFirst({ where: { id: postId } });
  }
  async deletePostById(id: string): Promise<Posts> {
    return this.prisma.posts.delete({ where: { id } });
  }
}
