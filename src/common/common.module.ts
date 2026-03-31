import { Module } from '@nestjs/common';
import { FileUploadService } from './services/file-upload.service';
import { UploadScalar } from './scalars/upload.scalar';
import { FileUploadResolver } from './resolvers/file-upload.resolver';

@Module({
  providers: [FileUploadService, UploadScalar, FileUploadResolver],
  exports: [FileUploadService, UploadScalar],
})
export class CommonModule {}
