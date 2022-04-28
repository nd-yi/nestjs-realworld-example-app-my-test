import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';


// TypeORM 支持存储库设计模式，因此每个实体都有自己的存储库 可以从数据库连接获得这些存储库
@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(type => ArticleEntity, article => article.comments)
  article: ArticleEntity;
}