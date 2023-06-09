import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Article } from '../../articles/schemas/article.schema';

@Injectable()
export class DoesArticleExist implements CanActivate {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;

    if (!mongoose.Types.ObjectId.isValid(params.articleId)) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Invalid ObjectId',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const article = await this.articleModel.findOne({ _id: params.articleId });
    if (article) {
      return true;
    }
    throw new NotFoundException('Article not found');
  }
}
