import { env } from "~/src/env";
import { createServerClient, serialize, parse } from "@supabase/ssr";

type CreateSupabaseClientArgs =
  | {
      cookies: Record<string, string>;
      headers: Headers;
    }
  | Request;

export function createSupabaseClient(args: CreateSupabaseClientArgs) {
  const isRequestArg = args instanceof Request;
  const cookies = isRequestArg
    ? parse(args.headers.get("Cookie") ?? "")
    : args.cookies;
  const headers = isRequestArg ? new Headers() : args.headers;

  const supabaseClient = createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_PUBLIC_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  return {
    supabaseClient,
    headers,
    cookies,
  };
}
