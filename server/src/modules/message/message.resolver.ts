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
import { CreateMessageInput, Message } from './message.dto';
import { createMessage, findMessages } from './message.service';
import { Context } from '../../utils/create-server';
import { findUserById } from '../user/user.service';

@Resolver(Message)
class MessageResolver {
  @Authorized()
  @Mutation(() => Message)
  async createMessage(
    @Arg('input') input: CreateMessageInput,
    @Ctx() context: Context,
    @PubSub() pubSub: PubSubEngine
  ) {
    const result = await createMessage({ ...input, userId: context.user?.id! });

    await pubSub.publish('NEW_MESSAGE', result);

    return result;
  }

  @FieldResolver()
  user(@Root() message: Message) {
    return findUserById(message.userId);
  }

  @Query(() => [Message])
  async messages() {
    return findMessages();
  }

  @Subscription(() => Message, {
    topics: 'NEW_MESSAGE',
  })
  newMessage(@Root() message: Message): Message {
    return message;
  }
}

export default MessageResolver;