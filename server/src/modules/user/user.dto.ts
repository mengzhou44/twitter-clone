import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { IsEmail, Length } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field(() => ID)
  email: string;

  @Field()
  isAdmin: boolean;

  password: string;
}

@InputType()
export class RegisterUserInput {
  @Field({
    nullable: false,
  })
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 56)
  password: string;

  @Field()
  isAdmin: boolean;

}

@InputType()
export class LoginInput {
  @Field({
    nullable: false,
  })
  usernameOrEmail: string;

  @Field()
  @Length(6, 56)
  password: string;
}

@ObjectType()
export class UserFollowers {
  @Field()
  count: number;

  @Field(() => [User])
  items: User[];
}

@InputType()
export class FollowUserInput {
  @Field()
  username: string;
}
