import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn, AfterUpdate, BeforeUpdate } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { Comment } from './comment.entity';


// Entity是由@Entity装饰器装饰的模型。将为此类模型创建数据库表
@Entity('article')
export class ArticleEntity {
  
  // 每个数据库表必须具有包含主键的列
  @PrimaryGeneratedColumn() // 创建主键（这是自动生成的主键
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({default: ''})
  description: string;

  @Column({default: ''})
  body: string;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created: Date;

  @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date;
  }

  @Column('simple-array')
  tagList: string[];

  @ManyToOne(type => UserEntity, user => user.articles)
  author: UserEntity;

  @OneToMany(type => Comment, comment => comment.article, {eager: true})
  @JoinColumn()
  comments: Comment[];

  @Column({default: 0})
  favoriteCount: number;
}