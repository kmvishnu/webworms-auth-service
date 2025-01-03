import bcrypt from "bcryptjs";
import User from "../../models/User";

export const verifyUser = async (email: string) => {
  try {
    const user = await User.findOne({ email: email });

    return user;
  } catch (error) {
    console.error("Error finding user:", error);
  }
};

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    4;
    return false;
  }
};

export const updateUser = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};
