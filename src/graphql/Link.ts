import { Prisma } from '.prisma/client';
import { objectType, extendType, nonNull, stringArg, intArg, inputObjectType, enumType, arg, list } from 'nexus';
import { NexusGenObjects } from '../../nexus-typegen';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('description');
    t.nonNull.string('url');
    t.nonNull.dateTime('createdAt');
    t.field('postedBy', {
      type: 'User',
      resolve: (parent, args, context) => {
        return context.prisma.link
          .findUnique({
            where: {
              id: parent.id
            }
          })
          .postedBy();
      }
    });
    t.nonNull.list.field('voters', {
      type: 'User',
      resolve: (parent, args, context) => {
        return context.prisma.link
          .findUnique({
            where: {
              id: parent.id
            }
          })
          .voters();
      }
    });
  }
});

export const Sort = enumType({
  name: 'Sort',
  members: ['asc', 'desc']
});

export const LinkOrderByInput = inputObjectType({
  name: 'LinkOrderByInput',
  definition(t) {
    t.field('description', { type: Sort }), t.field('url', { type: Sort }), t.field('createdAt', { type: Sort });
  }
});

// const links: NexusGenObjects['Link'][] = [
//   {
//     id: 1,
//     url: 'www.howtographql.com',
//     description: 'full stack tutorial for GraphQL'
//   },
//   {
//     id: 2,
//     url: 'graphql.org',
//     description: 'GraphQL official website'
//   }
// ];

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('feed', {
      type: 'Feed',
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) })
      },
      async resolve(parent, args, context) {
        const where = args.filter
          ? {
              OR: [{ descriptn: { contains: args.filter } }, { url: { contains: args.filter } }]
            }
          : {};

        const links = await context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined
        });

        const count = await context.prisma.link.count({ where });
        const id = `main-feed:$(JSON.stringfy(args))`;

        return { links, count, id };
      }
    });
  }
});

export const Feed = objectType({
  name: 'Feed',
  definition(t) {
    t.nonNull.list.nonNull.field('links', { type: Link }), t.nonNull.int('count'), t.id('id');
  }
});

export const LinkMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('post', {
      type: 'Link',
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg())
      },

      resolve: (parent, args, context) => {
        const { description, url } = args;
        // const { userId } = context;

        // if (!userId) {
        //   throw new Error('Cannot post without logging in.');
        // }

        const newLink = context.prisma.link.create({
          data: {
            description,
            url
            // postedBy: {
            //   connect: {
            //     id: userId
            //   }
            // }
          }
        });
        return newLink;
      }
    });
  }
});

export const LinkUpdate = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('update', {
      type: 'Link',
      args: {
        id: nonNull(intArg()),
        description: stringArg(),
        url: stringArg()
      },
      resolve: async (parent, { id: targetId, description, url }, context) => {
        const links = await context.prisma.link.findUnique({ where: { id: targetId } });

        if (!links) {
          return Error('cannot find link. id is not exist!');
        }

        const updateRes = await context.prisma.link.update({
          where: { id: targetId },
          data: {
            description,
            url
          }
        });

        return updateRes;
      }
    });
  }
});

export const LinkDelete = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('delete', {
      type: 'Link',
      args: {
        id: nonNull(intArg())
      },
      resolve: async (parent, { id: targetId }, context) => {
        const target = await context.prisma.link.findUnique({
          where: {
            id: targetId
          }
        });

        if (!target) {
          return Error(`id ${targetId} is not exist in Link data`);
        }

        const res = await context.prisma.link.delete({
          where: {
            id: targetId
          }
        });

        return res;
      }
    });
  }
});
