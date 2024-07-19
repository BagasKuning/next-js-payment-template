import React, { useState } from "react";
import { product } from "../libs/product";
import Link from "next/link";

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState('')

  const decreaseQuantity = () => {
    setQuantity((prevState) => (quantity > 1 ? prevState - 1 : null));
  };

  const increaseQuantity = () => {
    setQuantity((prevState) => prevState + 1);
  };

  const checkout = async () => {
    const data = {
      id: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity
    }

    const response = await fetch("/api/token", {
      method: "POST",
      body: JSON.stringify(data)
    })

    const requestData = await response.json()
    console.log(requestData)

    window.snap.pay(requestData.token)
  };

  const generatePaymentLink = async () => {
    const data = {
      transaction_details:
      {
        order_id: product.id,
        gross_amount: product.price * quantity
      },
      item_details: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity
        }
      ],
    }
    console.log(JSON.stringify(data))

    const secret = process.env.NEXT_PUBLIC_SERV
    const encodedSecret = Buffer.from(secret).toString('base64')
    const basicAuth = `Basic ${encodedSecret}`

    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/v1/payment-links`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': basicAuth
      },
      body: JSON.stringify(data)
    })

    const paymentLink = await response.json()
    setPaymentUrl(paymentLink.payment_url)
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex sm:gap-4">
          <button
            className="transition-all hover:opacity-75"
            onClick={decreaseQuantity}
          >
            ➖
          </button>

          <input
            type="number"
            id="quantity"
            value={quantity}
            className="h-10 w-16 text-black border-transparent text-center"
            onChange={quantity}
          />

          <button
            className="transition-all hover:opacity-75"
            onClick={increaseQuantity}
          >
            ➕
          </button>
        </div>
        <button
          className="rounded bg-indigo-500 p-4 text-sm font-medium transition hover:scale-105"
          onClick={checkout}
        >
          Checkout
        </button>
      </div>
      <button
        className="text-indigo-500 py-4 text-sm font-medium transition hover:scale-105"
        onClick={generatePaymentLink}
      >
        Create Payment Link
      </button>
      <div className=" text-black underline italic text-sm">
        <Link href={paymentUrl}>
          {paymentUrl ? "Klik disini untuk melakukan pembayaran" : ""}
        </Link>
      </div>
    </>
  );
};

export default Checkout;
