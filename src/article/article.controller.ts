import {Get, Post, Body, Put, Delete, Query, Param, Controller} from '@nestjs/common';
import { Request } from 'express';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './dto';
import { ArticlesRO, ArticleRO } from './article.interface';
import { CommentsRO } from './article.interface';
import { User } from '../user/user.decorator';

import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation, ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('articles')  // 为控制器附加一个标签
@Controller('articles')  //  路由的前缀 articles
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.'})  
  @Get()
  async findAll(@Query() query): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }


  @ApiOperation({ summary: 'Get article feed' }) // swagger
  @ApiResponse({ status: 200, description: 'Return article feed.'})  // 处理不同类型的状态码
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed') // 这也是路由前缀
  async getFeed(@User('id') userId: number, @Query() query): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne({slug});
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: number, @Body('article') articleData: CreateArticleDto) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@Param() params, @Body('article') articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')  // 获取动态的路由参数
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  async createComment(@Param('slug') slug, @Body('comment') commentData: CreateCommentDto) { // DTO（数据传输对象 它定义了如何通过网络发送数据
    return await this.articleService.addComment(slug, commentData);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param() params) {
    const {slug, id} = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: 'Favorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully favorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  async favorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully unfavorited.'})
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: number, @Param('slug') slug) {
    return await this.articleService.unFavorite(userId, slug);
  }

}