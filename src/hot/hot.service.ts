import { _ } from 'lodash';
import { Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from '../articles/schemas/article.schema';
import { Claim } from '../claims/schemas/claim.schema';
import { Model } from 'mongoose';
import { SavedArticle } from '../saved-articles/schemas/saved-article.schema';
import { SortByEnum, getSortByObject } from './enums/sort-by.enum';
import { DurationLimitEnum, getDurationQuery } from './enums/duration.enum';

@Injectable()
export class HotService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(SavedArticle.name) private savedModel: Model<SavedArticle>,
    @InjectModel(Claim.name) private claimModel: Model<Claim>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  findUsers(
    page = 1,
    perPage = 20,
    user: User | null,
    query: object,
  ): Promise<User[]> {
    return this.userModel
      .find(query)
      .skip(perPage * (page - 1))
      .limit(perPage)
      .sort({ nPositiveVotes: 'desc' });
  }

  async findArticles(
    page = 1,
    perPage = 20,
    user: User | null,
    query: object,
  ): Promise<Article[]> {
    const articles = await this.articleModel
      .find(query)
      .sort({ nPositiveVotes: 'desc' })
      .skip(perPage * (page - 1))
      .limit(perPage);

    let savedArticles = [];

    if (user) {
      savedArticles = await this.savedModel
        .find({
          addedBy: user._id,
        })
        .distinct('articleId');
    }

    return articles.map((it) => {
      return _.assign(it, { isSavedByUser: _.some(savedArticles, it._id) });
    });
  }

  findClaims(
    page = 1,
    perPage = 20,
    user: User | null,
    query: object,
    sortBy: SortByEnum | null,
    duration: DurationLimitEnum | null,
  ) {
    if (!sortBy) sortBy = SortByEnum.POSITIVE_VOTES_DESC;
    if (!duration) duration = DurationLimitEnum.MONTH;

    return this.claimModel
      .find(_.merge(query, getDurationQuery(duration)))
      .sort(getSortByObject(sortBy))
      .skip(perPage * (page - 1))
      .limit(perPage);
  }
}
