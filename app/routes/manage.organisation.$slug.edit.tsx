import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { createSupabaseClient } from "~/src/modules/database/client";
import { Label } from "~/ui/label";
import { Input } from "~/ui/input";
import { Button } from "~/ui/button";
import { useOrganisation } from "./manage.organisation.$slug";

const schema = z.object({
  organisationId: z.string({ required_error: "Stop messing with my form" }),
  contactLink: z.string().url(),
  displayName: z
    .string({ required_error: "Display name is required" })
    .min(3, "Display name is too short"),
});

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const slug = submission.value.displayName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { error } = await supabaseClient
    .from("organisation")
    .update({
      contact_link: submission.value.contactLink,
      display_name: submission.value.displayName,
      slug,
    })
    .eq("id", submission.value.organisationId);

  if (error) {
    return submission.reply({
      formErrors: [error.message],
    });
  }

  return redirect(`/manage/organisation/${slug}`);
}

export default function OrganisationEdit() {
  const organisation = useOrganisation();

  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    defaultValue: {
      contactLink: organisation.contact_link,
      displayName: organisation.display_name,
    },
  });
  return (
    <Form method="POST" {...getFormProps(form)}>
      <div id={form.errorId}>{form.errors}</div>
      <div className="space-y-3">
        <Label htmlFor={fields.displayName.id}>
          Display Name
          <Input {...getInputProps(fields.displayName, { type: "text" })} />
        </Label>
        <div id={fields.displayName.errorId}>{fields.displayName.errors}</div>

        <Label htmlFor={fields.contactLink.id}>
          Contact Link
          <Input {...getInputProps(fields.contactLink, { type: "url" })} />
        </Label>
        <div id={fields.contactLink.errorId}>{fields.contactLink.errors}</div>
      </div>
      <input
        type="hidden"
        name="organisationId"
        value={organisation.organisation_profile[0].organisation_id}
      />
      <Button>Update</Button>
    </Form>
  );
}
