import React from "react";
import "../styles/global.css"; // This should work if the styles folder is correctly located
import Button from "./Button"; // Ensure the correct import path for the Button component

function Card({ food, onAdd, onRemove }) {
  return (
    <div className="card">
      <h3>{food.title}</h3>
      <p>Price: ${food.price.toFixed(2)}</p>
      <img src={food.image} alt={food.title} className="food-image" />
      <div className="btn-container">
        <Button type="add" title="Add" onClick={() => onAdd(food)} />
        <Button type="remove" title="Remove" onClick={() => onRemove(food)} />
      </div>
    </div>
  );
}

export default Card;
