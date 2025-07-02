import { Outlet, useNavigation } from "react-router";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

import { retrieveCart } from "@/lib/data/cart";
import { retrieveCustomer } from "@/lib/data/customer";

import type { Route } from "./+types/main-layout";

export async function loader({ request }: Route.LoaderArgs) {
  const cart = await retrieveCart(request);
  const customer = await retrieveCustomer(request);

  return { cart, customer };
}

export default function MainLayout({ loaderData }: Route.ComponentProps) {
  const { state } = useNavigation();
  const isNavigating = state === "loading";
  const {} = loaderData;

  return (
    <div className="container py-10">
      {isNavigating && (
        <div className="bg-background/60 fixed inset-0 z-50 h-dvh cursor-progress" />
      )}

      <header className="flex justify-end">
        <Button variant="secondary" size="icon">
          <ShoppingBag />
        </Button>
      </header>
      <Outlet />
    </div>
  );
}
