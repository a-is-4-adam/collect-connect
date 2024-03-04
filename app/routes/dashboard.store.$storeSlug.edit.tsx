import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import { useActionData, Form } from "@remix-run/react";
import { Button } from "~/ui/Button";
import { Input } from "~/ui/Input";
import { InputGroup } from "~/ui/InputGroup";
import { Stack } from "~/ui/Stack";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";
import { createSupabaseClient } from "~/src/modules/database/client";
import { useCurrentStore } from "./dashboard.store.$storeSlug";

const schema = z.object({
  display_name: z
    .string({ required_error: "Display name is required" })
    .min(3, "Display name is too short"),
  slug: z
    .string({ required_error: "Slug is required" })
    .min(3, "Slug is too short"),
  contact_link: z.string().url().optional(),
  id: z.string({ required_error: "Stop messing with my form" }),
});

export function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await supabaseClient
    .from("store")
    .update({
      display_name: submission.value.display_name,
      slug: submission.value.slug,
      contact_link: submission.value.contact_link,
    })
    .eq("id", submission.value.id);

  if (data.error) {
    return submission.reply({
      formErrors: [data.error.message],
    });
  }

  return redirect(`/dashboard/store/${submission.value.slug}/edit`);
}

export default function DashboardStoreEdit() {
  const store = useCurrentStore();

  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    defaultValue: store,
  });

  return (
    <Form method="POST" {...getFormProps(form)} className="w-full">
      <div id={form.errorId}>{form.errors}</div>

      <Stack space="24" alignHorizontal="left">
        <Stack space="20">
          <InputGroup>
            <Label htmlFor={fields.display_name.id}>Display Name</Label>
            <Input {...getInputProps(fields.display_name, { type: "text" })} />
            <div id={fields.display_name.errorId}>
              {fields.display_name.errors}
            </div>
          </InputGroup>
          <InputGroup>
            <Label htmlFor={fields.slug.id}>Slug</Label>
            <Input
              {...getInputProps(fields.slug, {
                type: "text",
              })}
            />
            <div id={fields.slug.errorId}>{fields.slug.errors}</div>
          </InputGroup>
          <InputGroup>
            <Label htmlFor={fields.contact_link.id}>Contact Link</Label>
            <Input
              {...getInputProps(fields.contact_link, {
                type: "password",
              })}
            />
            <div id={fields.contact_link.errorId}>
              {fields.contact_link.errors}
            </div>
          </InputGroup>
          <input {...getInputProps(fields.id, { type: "hidden" })} />
        </Stack>
        <Button width="content">Update</Button>
      </Stack>
    </Form>
  );
}
