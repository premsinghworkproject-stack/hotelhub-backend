import { Scalar, CustomScalar } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload/GraphQLUpload.mjs';

@Scalar('Upload', () => GraphQLUpload)
export class UploadScalar implements CustomScalar<any, any> {
  description = 'Upload scalar type';

  parseValue(value: any): any {
    return value;
  }

  serialize(value: any): any {
    return value;
  }

  parseLiteral(ast: any): any {
    return ast;
  }
}
