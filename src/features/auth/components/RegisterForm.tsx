import * as React from "react";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "components/Elements";
import { Form, TextInputGroup } from "components/Form";
import { useAuth } from "lib/auth";

const schema = z
  .object({
    email: z.string().min(1, "Required"),
    first_name: z.string().min(1, "Required"),
    last_name: z.string().min(1, "Required"),
    password: z.string().min(1, "Required"),
  })
  .and(
    z
      .object({
        teamId: z.string().min(1, "Required"),
      })
      .or(z.object({ teamName: z.string().min(1, "Required") }))
  );

type RegisterValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  // teamId?: string;
  // teamName?: string;
};

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { register, isRegistering } = useAuth();

  return (
    <div>
      <Form<RegisterValues, typeof schema>
        onSubmit={async (values) => {
          await register(values);
          onSuccess();
        }}
        schema={schema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <>
            <TextInputGroup
              id="first-name"
              label="First Name"
              registration={register("first_name")}
              error={formState.errors["first_name"]}
            />
            <TextInputGroup
              id="last-name"
              label="Last Name"
              registration={register("last_name")}
              error={formState.errors["last_name"]}
            />
            <TextInputGroup
              id="email"
              type="email"
              label="Email Address"
              registration={register("email")}
              error={formState.errors["email"]}
            />
            <TextInputGroup
              id="password"
              type="password"
              label="Password"
              registration={register("password")}
              error={formState.errors["password"]}
            />
            <div>
              <Button
                isLoading={isRegistering}
                type="submit"
                className="w-full"
              >
                Register
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to="../login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
