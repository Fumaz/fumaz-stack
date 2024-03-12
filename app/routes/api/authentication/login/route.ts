import {z} from "zod";
import {zodAction} from "remix-zod";
import {authenticator} from "~/auth/authentication.server";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});
export type LoginSchema = z.infer<typeof LoginSchema>;

export const action = zodAction({
    body: LoginSchema
}, async ({
              request,
          }) => {
    return await authenticator.authenticate(request);
});

export type LoginActionData = typeof action;
export const loginActionRoute = () => '/api/authentication/login';
