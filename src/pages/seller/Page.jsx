import React, { useState } from "react";
import CreateProduct from "./create-product/CreateProduct"
import Products from "./products/components/Products/Products";

export default function SellerPage() {
  const userId = localStorage.getItem("userId");
  return (
    <div>
      <Products sellerId={userId}/>
    </div>
  );
}
