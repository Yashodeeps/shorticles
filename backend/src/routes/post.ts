import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: String;
  };
}>();

postRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("Authorization") || "";
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      message: "Unauthorized",
    });
  }
});

postRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const authorId = c.get("userId");
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
        authorId: String(authorId),
      },
    });

    return c.json({
      id: post.id,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while creating post",
    });
  }
});

postRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
        published: body.published,
      },
    });

    return c.json({
      id: post.id,
      post,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while updating post",
    });
  }
});

//todo: add pagination

postRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany();

    return c.json({
      posts: posts,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while fetching posts",
    });
  }
});

postRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    return c.json({
      post: post,
    });
  } catch (error) {
    c.status(411);
    return c.json({
      message: "Error while fetching ",
    });
  }
});
