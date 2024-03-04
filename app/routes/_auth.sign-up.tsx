import { ActionFunctionArgs, redirect } from "@remix-run/node";
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
import { Link } from "~/ui/Link";
import { InputGroup } from "~/ui/InputGroup";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password is too short"),
  name: z.string({ required_error: "Name is required" }),
});

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

  const {
    data: { user },
    error: signUpError,
  } = await supabaseClient.auth.signUp({
    email: submission.value.email,
    password: submission.value.password,
  });

  if (signUpError) {
    return submission.reply({
      formErrors: [signUpError.message],
    });
  }

  if (!user) {
    return submission.reply({
      formErrors: ["User could not be created. Please try again"],
    });
  }

  const store_id = crypto.randomUUID();

  await supabaseClient.rpc("insert_store_profile_on_signup", {
    user_id_input: user.id,
    profile_name_input: submission.value.name,
    store_id_input: store_id,
    store_display_name_input: store_id,
    store_slug_input: store_id,
  });

  return redirect(redirectURI, {
    headers,
  });
}

export default function SignUp() {
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
          <h2>Get started</h2>
        </Text>
        <Text className="text-gray-600">Create a new account</Text>
      </Stack>
      <Form method="POST" {...getFormProps(form)}>
        <Stack space="24">
          <Stack space="20">
            <InputGroup>
              <Label htmlFor={fields.name.id}>Your name</Label>
              <Input {...getInputProps(fields.name, { type: "text" })} />
              <div id={fields.name.errorId}>{fields.name.errors}</div>
            </InputGroup>

            <InputGroup>
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input {...getInputProps(fields.email, { type: "email" })} />
              <div id={fields.email.errorId}>{fields.email.errors}</div>
            </InputGroup>

            <InputGroup>
              <Label htmlFor={fields.password.id}>Password</Label>
              <Input
                {...getInputProps(fields.password, { type: "password" })}
              />
              <div id={fields.password.errorId}>{fields.password.errors}</div>
            </InputGroup>
          </Stack>
          <Button>Sign Up</Button>
        </Stack>
      </Form>
      <Text align="center" className="text-gray-600">
        Have an account? <Link to="/sign-in">Sign in now</Link>
      </Text>
    </Stack>
  );
}
