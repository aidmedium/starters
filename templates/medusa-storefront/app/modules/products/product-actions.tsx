import type { HttpTypes } from "@medusajs/types";

import { Button } from "@/components/ui/button";

export function ProductActions({
  product,
}: React.ComponentProps<"button"> & { product: HttpTypes.StoreProduct }) {
  function addToCart() {
    console.log(product);
  }

  return (
    <div>
      <Button onClick={addToCart}>Add to cart</Button>
    </div>
  );
}
