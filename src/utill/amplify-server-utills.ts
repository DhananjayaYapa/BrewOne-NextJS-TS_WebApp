import { authConfig } from "@/app/amplify-cognito-config";
import { NextServer, createServerRunner } from "@aws-amplify/adapter-nextjs";
import { getCurrentUser } from "aws-amplify/auth/server";

export const { runWithAmplifyServerContext } = createServerRunner({
    config: { Auth: authConfig },
});

export async function authenticatedUser(context: NextServer.Context) {
    return await runWithAmplifyServerContext({
      nextServerContext: context,
      operation: async (contextSpec) => {
        try {
          const user = {...(await getCurrentUser(contextSpec)), isAdmin: false};
          return user;
        } catch (error) {
          console.log(error);
        }
      },
    });
  }