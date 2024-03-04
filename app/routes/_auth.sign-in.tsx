import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { createSupabaseClient } from "~/src/modules/database/client";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { Button } from "~/ui/Button";
import { Label } from "~/ui/Label";
import { Input } from "~/ui/Input";
import { Text } from "~/ui/Text";
import { Stack } from "~/ui/Stack";
import { InputGroup } from "~/ui/InputGroup";

import { Link } from "~/ui/Link";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, "Password is too short"),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient, headers } = createSupabaseClient(request);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const redirectURI = searchParams.get("redirect_uri") ?? "/";

  const { data } = await supabaseClient.auth.getSession();

  if (data.session) {
    return redirect(redirectURI, {
      headers,
    });
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = createSupabaseClient(request);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const redirectURI = searchParams.get("redirect_uri") ?? "/dashboard";

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await supabaseClient.auth.signInWithPassword(submission.value);
  if (data.error) {
    return submission.reply({
      formErrors: [data.error.message],
    });
  }

  return redirect(redirectURI, {
    headers,
  });
}

export default function SignIn() {
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Stack space="32">
      <Stack space="12">
        <Text asChild size="heading-sm" weight="semibold">
          <h2>Welcome back</h2>
        </Text>
        <Text className="text-gray-600">Sign in to your account</Text>
      </Stack>
      <Form method="POST" {...getFormProps(form)}>
        <div id={form.errorId}>{form.errors}</div>

        <Stack space="24">
          <Stack space="20">
            <InputGroup>
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input {...getInputProps(fields.email, { type: "email" })} />
              <div id={fields.email.errorId}>{fields.email.errors}</div>
            </InputGroup>
            <InputGroup>
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input
                {...getInputProps(fields.password, {
                  type: "password",
                })}
              />
              <div id={fields.password.errorId}>{fields.password.errors}</div>
            </InputGroup>
          </Stack>
          <Button>Sign in</Button>
        </Stack>
      </Form>
      <Text align="center" className="text-gray-600">
        Don't have an account? <Link to="/sign-up">Sign up</Link>
      </Text>
    </Stack>
  );
}
