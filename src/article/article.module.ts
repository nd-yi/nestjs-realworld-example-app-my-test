import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { Comment } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { ArticleService } from './article.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

// @Module() 装饰器提供了元数据，Nest 用它来组织应用程序结构。
@Module({  
  imports: [TypeOrmModule.forFeature([ArticleEntity, Comment, UserEntity, FollowsEntity]), UserModule], // 导入模块的列表，这些模块导出了此模块中所需提供者
  providers: [ArticleService],  // 注册服务
  controllers: [
    ArticleController  // 控制器总是属于模块，这就是为什么我们在 @Module() 装饰器中包含 controllers 数组的原因
  ]
})
export class ArticleModule implements NestModule { 
  public configure(consumer: MiddlewareConsumer) {  //必须使用模块类的 configure() 方法来设置中间件 包含中间件的模块必须实现 NestModule 接口
    consumer
      .apply(AuthMiddleware)
      .forRoutes(  // 权限控制
        {path: 'articles/feed', method: RequestMethod.GET},
        {path: 'articles', method: RequestMethod.POST},
        {path: 'articles/:slug', method: RequestMethod.DELETE},
        {path: 'articles/:slug', method: RequestMethod.PUT},
        {path: 'articles/:slug/comments', method: RequestMethod.POST},
        {path: 'articles/:slug/comments/:id', method: RequestMethod.DELETE},
        {path: 'articles/:slug/favorite', method: RequestMethod.POST},
        {path: 'articles/:slug/favorite', method: RequestMethod.DELETE});
  }
}
