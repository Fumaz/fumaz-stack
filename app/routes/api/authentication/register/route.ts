import {z} from "zod";
import {zodAction} from "remix-zod";
import {database} from "~/database/database";
import {json} from "@remix-run/node";

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string(),
    lastName: z.string().nullable(),
    language: z.enum(['en', 'it'])
});
export type RegisterSchema = z.infer<typeof RegisterSchema>;

export const action = zodAction({
    body: RegisterSchema
}, async ({
              parsedBody
          }) => {
    const bcrypt = await import('bcrypt');
    const existingByEmail = await database.user.findUnique({
        where: {
            email: parsedBody.email
        }
    });

    if (existingByEmail) {
        throw json({
            error: 'registration.results.emailAlreadyExists'
        }, {
            status: 400
        });
    }

    const user = await database.user.create({
        data: {
            email: parsedBody.email,
            password: await bcrypt.hash(parsedBody.password, 10),
            firstName: parsedBody.firstName,
            lastName: parsedBody.lastName,
            language: parsedBody.language
        },
        select: {
            uuid: true,
            email: true,
            firstName: true,
            lastName: true,
        }
    });

    return json({
        user,
        message: 'registration.results.successful'
    });
});

export type RegisterActionData = typeof action;
export const registerActionRoute = () => '/api/authentication/register';
