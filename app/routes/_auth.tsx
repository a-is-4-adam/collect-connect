import { Outlet } from "@remix-run/react";
import logo from "../assets/logo.svg";
import { Link } from "~/ui/Link";

export default function AuthLayout() {
  return (
    <>
      <header className="border-b border-gray-300 bg-white py-6 px-24 absolute top-0 w-full">
        <Link to="/" className="inline-block">
          <img alt="Collect Connect logo" src={logo} className="h-[50px]" />
        </Link>
      </header>
      <div className="flex">
        <main className="flex justify-center items-center flex-grow flex-shrink-0 min-h-screen pt-80 xl:basis-2/5">
          <section className="max-w-sm w-full pt-32">
            <Outlet />
          </section>
        </main>
        <aside className="bg-gradient-to-r from-brand-300 to-brand-600 hidden w-full xl:block"></aside>
      </div>
    </>
  );
}
