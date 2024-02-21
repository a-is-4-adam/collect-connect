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
import { Button } from "~/ui/button";
import { Label } from "~/ui/label";
import { Input } from "~/ui/input";

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
  const redirectURI = searchParams.get("redirect_uri") ?? "/";

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

export default function Login() {
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
          <Button>Login</Button>
        </Form>
      </section>
    </div>
  );
}
