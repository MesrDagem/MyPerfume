import React from "react";
import "../styles/global.css"; // This should work if the styles folder is correctly located
import Button from "./Button"; // Ensure the correct import path for the Button component

function Cart({ cartItems, onCheckout, onRemove }) {
  const totalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <p>
                {item.title} x {item.quantity}
                <Button
                  type="remove"
                  title="Remove"
                  onClick={() => onRemove(item)}
                />
              </p>
            </div>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <Button type="checkout" title="Checkout" onClick={onCheckout} />
        </>
      )}
    </div>
  );
}

export default Cart;
