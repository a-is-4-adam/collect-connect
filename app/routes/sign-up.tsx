import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { createSupabaseClient } from "~/src/modules/database/client";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { Button } from "~/ui/button";
import { Label } from "~/ui/label";
import { Input } from "~/ui/input";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password is too short"),
  name: z.string({ required_error: "Name is required" }).optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = createSupabaseClient(request);

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const redirectURI = searchParams.get("redirect_uri") ?? "/";

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

  const organisation_id = crypto.randomUUID();

  const data = await supabaseClient.rpc(
    "insert_organisation_profile_on_signup",
    {
      user_id_input: user.id,
      profile_name_input: submission.value.name,
      organisation_id_input: organisation_id,
      organisation_display_name_input: organisation_id,
      organisation_slug_input: organisation_id,
    }
  );

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
    <div className="flex justify-center items-center h-svh">
      <section className="max-w-xl w-full">
        <Form method="POST" {...getFormProps(form)}>
          <div id={form.errorId}>{form.errors}</div>
          <div className="space-y-3">
            <Label htmlFor={fields.name.id}>
              Name
              <Input {...getInputProps(fields.name, { type: "text" })} />
            </Label>
            <div id={fields.name.errorId}>{fields.name.errors}</div>

            <Label htmlFor={fields.email.id}>
              Email
              <Input {...getInputProps(fields.email, { type: "email" })} />
            </Label>
            <div id={fields.email.errorId}>{fields.email.errors}</div>

            <Label htmlFor={fields.password.id}>
              Password
              <Input
                {...getInputProps(fields.password, { type: "password" })}
              />
            </Label>
            <div id={fields.password.errorId}>{fields.password.errors}</div>
          </div>
          <Button>Sign Up</Button>
        </Form>
      </section>
    </div>
  );
}
