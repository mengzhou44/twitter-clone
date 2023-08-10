import { Field, ObjectType } from "type-graphql";


@ObjectType()
export class OrderStats {
  @Field()
  new: number

  @Field()
  open: number;

  @Field()
  completed: number;

  @Field()
  cancelled: number;

  @Field()
  pending: number

   
}