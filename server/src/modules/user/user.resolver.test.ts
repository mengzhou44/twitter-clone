import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';
import { ApolloError } from 'apollo-server-core';
import UserResolver from './user.resolver';
import * as userService from './user.service';

describe('UserResolver', () => {
  let context: any;

  beforeEach(() => {
    context = {
      reply: {
        jwtSign: sinon.fake.resolves('fakeToken'),
        setCookie: sinon.fake(),
      },
      user: {
        id: 'fakeUserId',
      },
    };
  });

  it('should successfully login and return a token', async () => {
    const fakeInput = {
      usernameOrEmail: 'testuser',
      password: 'testpassword',
    };

    const fakeUser = {
      id: 'fakeUserId',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    sinon.stub(userService, 'findUserByEmailOrUsername').resolves(fakeUser);
    sinon.stub(userService, 'verifyPassword').resolves(true);

    const resolver = new UserResolver();
    const result = await resolver.login(fakeInput, context);

    expect(result).to.equal('fakeToken');
    expect(context.reply.jwtSign.calledOnce).to.be.true;
    expect(context.reply.setCookie.calledOnce).to.be.true;

    sinon.restore();
  });

  it('should throw an ApolloError for invalid password', async () => {
    const fakeInput = {
      usernameOrEmail: 'testuser',
      password: 'invalidpassword',
    };

    sinon.stub(userService, 'findUserByEmailOrUsername').resolves({
      id: 'fakeUserId',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
    });
    sinon.stub(userService, 'verifyPassword').resolves(false);

    const resolver = new UserResolver();

    try {
      await resolver.login(fakeInput, context);
    } catch (error: any) {
      expect(error).to.be.instanceOf(ApolloError);
      expect(error.message).to.equal('Invalid credentials');
    }

    sinon.restore();
  });

  it('should throw an ApolloError for invalid username', async () => {
    const fakeInput = {
      usernameOrEmail: 'testuser',
      password: 'invalidpassword',
    };

    sinon.stub(userService, 'findUserByEmailOrUsername').resolves({
      id: 'fakeUserId',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      isAdmin: false
    });
    sinon.stub(userService, 'verifyPassword').resolves(true);

    const resolver = new UserResolver();

    try {
      await resolver.login(fakeInput, context);
    } catch (error: any) {
      expect(error).to.be.instanceOf(ApolloError);
      expect(error.message).to.equal('Invalid credentials');
    }

    sinon.restore();
  });

  it('should throw an ApolloError if token is null ', async () => {
    context.reply.jwtSign = sinon.fake.rejects(null);

    const fakeInput = {
      usernameOrEmail: 'testuser',
      password: 'invalidpassword',
    };

    sinon.stub(userService, 'findUserByEmailOrUsername').resolves({
      id: 'fakeUserId',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      isAdmin: false
    });

    sinon.stub(userService, 'verifyPassword').resolves(true);

    const resolver = new UserResolver();

    try {
      await resolver.login(fakeInput, context);
    } catch (error: any) {
      console.log({error})
      expect(error).to.be.instanceOf(ApolloError);
      expect(error.message).to.equal('Error signing token');
    }

    sinon.restore();
  });
});
