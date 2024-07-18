import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      id: a.id(),
      firstName: a.string(),
      lastName: a.string(),
      email: a.email(),
      phone: a.phone(),
      isActive: a.boolean(),
      userimage: a.string(),
      accessToken: a.string(),
      refreshToken: a.string(),
      reserveID: a.string(),
      username: a.string(),
      events: a.hasMany('Event', 'id').index('EventByUser'),
      rsvps: a.hasMany('Rsvp', 'id').index('byUser'),
      groups: a.manyToMany('Group', 'GroupUser')
    })
    .authorization((allow) => [
      allow.publicApiKey()
    ]),
  Group: a
    .model({
      id: a.id(),
      title: a.string(),
      numMembers: a.integer(),
      isApproved: a.boolean(),
      creatorid: a.id().index('GroupByUser'),
      users: a.manyToMany('User', 'GroupUser'),
      events: a.hasMany('Event', 'id').index('byGroup')
    })
    .authorization((allow) => [
      allow.publicApiKey()
    ]),
  Event: a
    .model({
      id: a.id(),
      title: a.string(),
      address: a.string(),
      description: a.string(),
      start_datetime: a.datetime(),
      end_datetime: a.datetime(),
      venue_name: a.string(),
      isApproved: a.boolean(),
      eventimage: a.string(),
      user: a.belongsTo('User', 'organizerid').index('EventByUser'),
      organizerid: a.id(),
      group: a.belongsTo('Group', 'groupid').index('byGroup'),
      groupid: a.id(),
      rsvps: a.hasMany('Rsvp', 'id').index('byEvent'),
      rsvp_total: a.integer(),
      venmo: a.string()
    })
    .authorization((allow) => [
      allow.publicApiKey()
    ]),
  Rsvp: a
    .model({
      id: a.id(),
      status: a.integer(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      user: a.belongsTo('User', 'userid').index('byUser', 'start_datetime'),
      userid: a.id(),
      event: a.belongsTo('Event', 'eventid').index('byEvent'),
      eventid: a.id(),
      start_datetime: a.datetime()
    })
    .authorization((allow) => [
      allow.publicApiKey()
    ]),
});

// Used for code completion / highlighting when making requests from frontend
export type Schema = ClientSchema<typeof schema>;

// defines the data resource to be deployed
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
