import { Request, Response } from "express";
import { StatusCode } from "../utils/statusCode";
import User from "../db/models/user.model";
import { generateRandomToken } from "../utils/randomToken";
import Token from "../db/models/token.model";
import { sendEmail } from "../utils/emailService";
import { createToken } from "../utils/generateToken";


// Login user
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.logIn(email, password);

    // create token
    const tokenJWT = createToken(user._id);
    // respone
    res.status(200).json({ user , tokenJWT });

  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};  

// SignUp user
const signUpUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.signUp(email, password);

    // Token verified
    const tokenLength = user._id.toString().length; // Convert the user ID to a string and get its length
    if (!tokenLength || isNaN(tokenLength)) {
      throw new Error("Invalid token length");
    }
    const token = generateRandomToken(tokenLength); // Generate a token based on the user ID length
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 1);

    // Save the token to the Token collection 
    await Token.create({ userId: user._id, token, expiresAt });

    // Create jwt token
    const tokenJWT = createToken(user._id);

    // Send an email to the user
    await sendEmail(
      email,
      "Welcome to Our App",
      `Thank you for signing up! please click here for verify your email:http://localhost:4000/api/user/verify?token=${token}.`
    );

    res.status(StatusCode.OK).json({ email,expiresAt , tokenJWT });
  } catch (err: any) {
    res.status(StatusCode.BadRequest).json({ message: err.message });
  }
};

export { loginUser, signUpUser };
