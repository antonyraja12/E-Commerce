const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");
const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const newUser = await query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// const loginUser = async (req, res) => {
//   try {
//     const { identifier, password } = req.body; // identifier can be username or email

//     // Check if user exists by username or email
//     const user = await query(
//       "SELECT * FROM Users WHERE email = $1 OR username = $1",
//       [identifier]
//     );

//     if (user.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Check password
//     const validPassword = await bcrypt.compare(password, user.rows[0].password);
//     if (!validPassword) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Create and send JWT token
//     const token = jwt.sign(
//       { userId: user.rows[0].id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     res.json({ token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.json({ token, success: true });
  } catch (err) {
    console.error("Error in loginUser:", err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { registerUser, loginUser };
