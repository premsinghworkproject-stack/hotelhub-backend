import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { Room } from '../../database/models/room.model';
import { RoomWithImagesService } from './room-with-images.service';
import { CreateRoomWithImagesInput, UpdateRoomWithImagesInput } from './dto/room-with-images.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guards/auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UserTokenPayload } from 'src/common/constants/app.constant';

@Resolver(() => Room)
export class RoomWithImagesResolver {
  constructor(private readonly roomWithImagesService: RoomWithImagesService) {}

  @Mutation(() => Room, { 
    name: 'createRoomWithImages',
    description: 'Create a new room with multiple image uploads'
  })
  @UseGuards(GqlAuthGuard)
  async createRoomWithImages(
    @Args('input') input: CreateRoomWithImagesInput, 
    @AuthUser() user: UserTokenPayload
  ): Promise<Room> {
    return this.roomWithImagesService.createWithImages(input, user.sub);
  }

  @Mutation(() => Room, { 
    name: 'updateRoomWithImages',
    description: 'Update room with image management (add/delete images)'
  })
  @UseGuards(GqlAuthGuard)
  async updateRoomWithImages(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateRoomWithImagesInput,
    @AuthUser() user: UserTokenPayload
  ): Promise<Room> {
    return this.roomWithImagesService.updateWithImages(id, input, user.sub);
  }
}
