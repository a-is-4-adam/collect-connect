import {
  useForm,
  getFormProps,
  getInputProps,
  getSelectProps,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import { useActionData, Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/ui/Button";
import { Input } from "~/ui/Input";
import { InputGroup } from "~/ui/InputGroup";
import { Stack } from "~/ui/Stack";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { z } from "zod";
import { createSupabaseClient } from "~/src/modules/database/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/Select";
import { getItems } from "~/src/modules/database/getItems";
import { getQualities } from "~/src/modules/database/getQualities";

const schema = z.object({
  itemId: z.string({ required_error: "An item is required" }).uuid(),
  quality: z.union([z.literal("mint"), z.literal("near-mint")]),
  price: z.number(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabaseClient } = createSupabaseClient(request);
  const items = await getItems(supabaseClient);
  const qualities = getQualities();
  return json({ items, qualities });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { storeSlug } = params;

  if (!storeSlug) {
    return redirect("/dashboard");
  }

  const { supabaseClient } = createSupabaseClient(request);

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    console.log(submission.payload);
    return submission.reply();
  }

  const { data: sessionData } = await supabaseClient.auth.getSession();

  if (sessionData.session) {
    const { data: storeProfileData } = await supabaseClient
      .from("store_profile")
      .select(
        `
            store (id)
        `
      )
      .eq("store.slug", storeSlug)
      .single();

    const store = storeProfileData?.store;

    if (!store) {
      throw Error("No store created for user");
    }

    await supabaseClient.from("inventory_item").insert({
      store_id: store.id,
      profile_id: sessionData.session.user.id,
      status: "available",
      item_id: submission.value.itemId,
      tags: {
        quality: submission.value.quality,
        price: submission.value.price.toLocaleString(),
      },
    });

    return redirect(`/dashboard/store/${storeSlug}`);
  }

  throw Error("user not logged in");
}

export default function DashboardInventoryAdd() {
  const { items, qualities } = useLoaderData<typeof loader>();
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

  const itemIdSelectProps = getSelectProps(fields.itemId);
  const qualitySelectProps = getSelectProps(fields.quality);

  return (
    <Form method="POST" {...getFormProps(form)} className="w-full">
      <div id={form.errorId}>{form.errors}</div>

      <Stack space="24" alignHorizontal="left">
        <Stack space="20">
          <InputGroup>
            <Label htmlFor={fields.itemId.id}>Item</Label>
            <Select
              {...itemIdSelectProps}
              defaultValue={itemIdSelectProps.defaultValue?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.tags.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div id={fields.itemId.errorId}>{fields.itemId.errors}</div>
          </InputGroup>
          <InputGroup>
            <Label htmlFor={fields.quality.id}>Quality</Label>
            <Select
              {...qualitySelectProps}
              defaultValue={qualitySelectProps.defaultValue?.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                {qualities.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div id={fields.quality.errorId}>{fields.itemId.errors}</div>
          </InputGroup>
          <InputGroup>
            <Label htmlFor={fields.price.id}>Price</Label>
            <Input {...getInputProps(fields.price, { type: "number" })} />
            <div id={fields.price.errorId}>{fields.price.errors}</div>
          </InputGroup>
        </Stack>
        <Button width="content">Add</Button>
      </Stack>
    </Form>
  );
}
