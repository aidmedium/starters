import { Heading } from "@/components/ui/text";

import { addToCart } from "@/lib/data/cart";

import type { Route } from "./+types/cart";

export async function action({ request }: Route.ActionArgs) {
  const data = await request.json();

  const headers = new Headers();
  await addToCart(request, {
    variantId: data.variantId,
    quantity: data.quantity,
    responseHeaders: headers,
  });

  return Response.json({ message: "Success" }, { headers });
}

export default function Cart() {
  return (
    <>
      <Heading variant="h2">Cart</Heading>
    </>
  );
}
