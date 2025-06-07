import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
    token: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Check if user with this email already exists
    const user = await ctx.db
      .query("users") // access "users" table/collection
      .filter((q) => q.eq(q.field("email"), args.email)) // where email === args.email
      .collect(); // get all matching records as an array

    console.log(user);

    // 2. If no user found, insert a new one
    if (user?.length == 0) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        picture: args.picture,
        email: args.email,
        uid: args.uid,
        token: 50000, // default token value (e.g., credits)
      });
      console.log(result);
    }
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.userId, {
      token: args.token,
    });
    return result;
  },
});