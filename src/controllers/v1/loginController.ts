import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyUser } from "../../components/v1/userComponent";
import { saveRefreshToken } from "../../config/redisClient";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user: any = await verifyUser(email);

    if (user === null) {
      return res.status(401).json({ error: "Invalid email or password" }); 
    }

    const hashedPassword = user ? user.password : "";

    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const jwtRefreshKey = process.env.JWT_REFRESH_KEY;

    const data = {
      time: Date(),
      name: user.name,
      id: user._id,
      exp: Math.floor(Date.now() / 1000) + Number(process.env.EXPIRESIN),
    };

    const refreshData = {
      time: Date(),
      name: user.name,
      id: user._id,
      exp:
        Math.floor(Date.now() / 1000) +
        Number(process.env.REFRESH_TOKEN_EXPIRESIN),
    };
    const token = jwt.sign(data, jwtSecretKey);
    const refreshToken = jwt.sign(refreshData, jwtRefreshKey);
    saveRefreshToken(
      refreshToken,
      user._id,
      Number(process.env.REFRESH_TOKEN_EXPIRESIN)
    );

    res
      .status(200)
      .json({
        status: "success",
        token,
        refreshToken,
        name: user ? user.name : "",
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" }); // Return generic error response
  }
};
