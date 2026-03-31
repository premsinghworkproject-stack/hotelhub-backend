import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { RoomType } from '../../database/models/room-type.model';
import { RoomTypeWithImagesService } from './room-type-with-images.service';
import { CreateRoomTypeWithImagesInput, UpdateRoomTypeWithImagesInput } from './dto/room-type-with-images.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guards/auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { UserTokenPayload } from 'src/common/constants/app.constant';

@Resolver(() => RoomType)
export class RoomTypeWithImagesResolver {
  constructor(private readonly roomTypeWithImagesService: RoomTypeWithImagesService) {}

  @Mutation(() => RoomType, { 
    name: 'createRoomTypeWithImages',
    description: 'Create a new room type with multiple image uploads'
  })
  @UseGuards(GqlAuthGuard)
  async createRoomTypeWithImages(
    @Args('input') input: CreateRoomTypeWithImagesInput, 
    @AuthUser() user: UserTokenPayload
  ): Promise<RoomType> {
    return this.roomTypeWithImagesService.createWithImages(input, user.sub);
  }

  @Mutation(() => RoomType, { 
    name: 'updateRoomTypeWithImages',
    description: 'Update room type with image management (add/delete images)'
  })
  @UseGuards(GqlAuthGuard)
  async updateRoomTypeWithImages(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateRoomTypeWithImagesInput,
    @AuthUser() user: UserTokenPayload
  ): Promise<RoomType> {
    return this.roomTypeWithImagesService.updateWithImages(id, input, user.sub);
  }
}
