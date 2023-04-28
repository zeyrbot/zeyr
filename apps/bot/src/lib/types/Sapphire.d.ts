import type { PrismaClient } from "@prisma/client";

declare module "@sapphire/framework" {
  interface Preconditions {
    DevOnly: never;
  }
}

declare module "@sapphire/pieces" {
  interface Container {
    prisma: PrismaClient;
  }
}

declare module "@kbotdev/plugin-modules" {
  interface Modules {
    SystemModule: never;
  }
}

export default undefined;
