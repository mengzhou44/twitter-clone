import UserResolver from './user/user.resolver';
import MessageResolver from './message/message.resolver';
import OrderStatsResolver from './order-stats/order-stats.resolver';
import { NonEmptyArray } from 'type-graphql';

export const resolvers = [UserResolver, MessageResolver, OrderStatsResolver] as NonEmptyArray<Function>