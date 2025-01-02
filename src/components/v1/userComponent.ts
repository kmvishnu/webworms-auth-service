import User from "../../models/User";

export const verifyUser = async (email: string) => {
    try {
        const user = await User.findOne({ emailId : email });
    
        return user
      } catch (error) {
        console.error('Error finding user:', error);
      }
};
