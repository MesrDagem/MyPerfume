import mysql from "mysql2";

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("Request Body:", req.body); // Log request body for debugging

    const { name, phone, comments, items, total } = req.body;

    // Validate required fields
    if (!name || !phone || !items || !total) {
      return res
        .status(400)
        .send({ error: "All required fields must be filled" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).send({ error: "Items must be a non-empty array" });
    }

    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error("Transaction Error:", err);
        return res.status(500).send({ error: "Transaction error" });
      }

      // Insert user data
      const sqlUser = "INSERT INTO users (name, phone) VALUES (?, ?)";
      db.query(sqlUser, [name, phone], (err, userResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("User Insert Error:", err);
            return res.status(500).send({ error: "User insert error" });
          });
        }

        const userId = userResult.insertId;

        // Insert order data
        const sqlOrder =
          "INSERT INTO orders (user_id, total, comments) VALUES (?, ?, ?)";
        db.query(sqlOrder, [userId, total, comments], (err, orderResult) => {
          if (err) {
            return db.rollback(() => {
              console.error("Order Insert Error:", err);
              return res.status(500).send({ error: "Order insert error" });
            });
          }

          const orderId = orderResult.insertId;

          // Prepare order items for insertion
          const sqlOrderItems =
            "INSERT INTO order_items (order_id, food_id, quantity) VALUES ?";

          const orderItems = items.map((item) => [
            orderId,
            item.id, // Use item.id for food_id
            item.quantity,
          ]);

          db.query(sqlOrderItems, [orderItems], (err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Order Items Insert Error:", err);
                return res
                  .status(500)
                  .send({ error: "Order items insert error" });
              });
            }

            // Commit transaction if all queries were successful
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Commit Error:", err);
                  return res.status(500).send({ error: "Commit error" });
                });
              }
              return res
                .status(200)
                .send({ message: "Order placed successfully!" });
            });
          });
        });
      });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
