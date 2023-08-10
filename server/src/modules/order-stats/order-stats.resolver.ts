import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { OrderStats } from './order-stats.dto';
 
 
@Resolver(OrderStats)
class OrderStatsResolver {
 
  @Query(() => OrderStats)
  async stats() {
     let record  = new OrderStats();
     record.new= 10
     record.open= 1
     record.completed= 0
     record.cancelled= 0
     record.pending= 0 
    
    return record
  } 
}

export default OrderStatsResolver;
