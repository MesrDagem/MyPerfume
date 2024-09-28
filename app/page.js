"use client"; // This directive enables the component to be rendered on the client side.

import React, { useState, useEffect, useRef } from "react";
import Card from "../Components/Card";
import Cart from "../Components/Cart";
import { Toaster, toast } from "sonner";
import localFont from "next/font/local";
import "../styles/global.css"; // Ensure this path is correct

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Food items data
const foods = [
  { id: 1, title: "Coca", price: 3.5, image: "/images/coca.png" },
  { id: 2, title: "Burger", price: 15, image: "/images/burger.png" },
  { id: 3, title: "Pizza", price: 17.99, image: "/images/pizza.png" },
  { id: 4, title: "Kebab", price: 13.99, image: "/images/kebab.png" },
  { id: 5, title: "Bottle of water", price: 0.99, image: "/images/water.png" },
];

// Telegram mock object
const tele =
  typeof window !== "undefined" && window.Telegram
    ? window.Telegram.WebApp
    : {
        ready: () => console.log("Mock ready"),
        MainButton: {
          text: "",
          show: () => console.log("Mock MainButton show"),
          sendData: (data) => console.log("Mock sendData:", data),
        },
      };

export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");
  const [showForm, setShowForm] = useState(false);
  const orderFormRef = useRef(null);

  // Check if Telegram WebApp is available and ready
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram) {
      window.Telegram.WebApp.ready();
    } else {
      console.log("Telegram WebApp is not available");
    }
  }, []);

  // Function to add food to the cart
  const onAdd = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist) {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...food, quantity: 1 }]);
    }
  };

  // Function to remove food from the cart
  const onRemove = (food) => {
    const exist = cartItems.find((x) => x.id === food.id);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== food.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === food.id ? { ...exist, quantity: exist.quantity - 1 } : x
        )
      );
    }
  };

  // Function to checkout
  const onCheckout = () => {
    if (cartItems.length === 0) {
      toast("Your cart is empty. Please add items before checking out.");
      return;
    }
    setShowForm(true);
    // Scroll to the form smoothly
    if (orderFormRef.current) {
      orderFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to submit the order
  const onSubmitOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      name,
      phone,
      comments,
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      total: cartItems.reduce((a, c) => a + c.price * c.quantity, 0),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error || "Order submission failed."}`);
        return;
      }

      const data = await response.json();
      toast.success(data.message || "Order placed successfully!");
      setCartItems([]); // Clear the cart
      setShowForm(false); // Hide the order form
      setName(""); // Reset name field
      setPhone(""); // Reset phone field
      setComments(""); // Reset comments field
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <div className={geistSans.variable}>
        <div className="heading">
          <h1>Welcome to Our Food Delivery Service</h1>
          <p className="subheading">Choose your favorite food</p>
        </div>

        <div className="main-container">
          <div className="food-cards">
            {foods.map((food) => (
              <Card
                key={food.id}
                food={food}
                onAdd={onAdd}
                onRemove={onRemove}
              />
            ))}
          </div>

          <Cart
            cartItems={cartItems}
            onRemove={onRemove}
            onCheckout={onCheckout}
          />
        </div>

        {showForm && (
          <form
            ref={orderFormRef}
            className="order-form"
            onSubmit={onSubmitOrder}
          >
            <h2>Order Form</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <textarea
              placeholder="Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <button type="submit">Submit Order</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </>
  );
}
