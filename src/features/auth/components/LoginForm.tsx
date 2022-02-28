import { Link } from "react-router-dom";
import { z } from "zod";

import { Button } from "components/Elements";
import { Form } from "components/Form";
import { useAuth } from "lib/auth";
import { TextInputGroup } from "components/Form";

const schema = z.object({
  username: z.string().min(3, "Enter a valid email address."),
  password: z.string().min(8, "Enter a password of at least 8 characters."),
});

type LoginValues = {
  username: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login, isLoggingIn } = useAuth();

  return (
    <div>
      <Form<LoginValues, typeof schema>
        onSubmit={async (values) => {
          await login(values);
          onSuccess();
        }}
        schema={schema}
      >
        {({ register, formState }) => (
          <>
            <TextInputGroup
              id="email"
              type="email"
              label="Email Address"
              registration={register("username")}
              error={formState.errors["username"]}
            />
            <TextInputGroup
              id="password"
              type="password"
              label="Password"
              registration={register("password")}
              error={formState.errors["password"]}
            />
            <div>
              <Button isLoading={isLoggingIn} type="submit" className="w-full">
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to="../register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
