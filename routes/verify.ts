import express, { Request, Response } from "express";
import Token from "../db/models/token.model";
import User from "../db/models/user.model";
import { StatusCode } from "../utils/statusCode";
import { generateRandomToken } from "../utils/randomToken";
import { sendEmail } from "../utils/emailService";

const router = express.Router();

router.get("/verify", async (req: Request, res: Response) => {
  const { token } = req.query;
  try {
    // Find the token in the database
    let tokenDoc = await Token.findOne({ token });
    if (!tokenDoc) {
      throw new Error("Invalid token");
    }

    // Check if the token has expired
    if (tokenDoc.expiresAt < new Date()) {

      // Token has expired, delete the token
      await Token.deleteOne({ token });

      // Generate a new token
      const tokenLength = tokenDoc.userId.toString().length;
      const newToken = generateRandomToken(tokenLength);
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 1);

      // Save the new token to the Token collection
      tokenDoc = await Token.create({
        userId: tokenDoc.userId,
        token: newToken,
        expiresAt,
      });

      // Send a new email to the user with the new token
      const user = await User.findById(tokenDoc.userId);
      if (!user) {
        throw new Error("User not found");
      }
      await sendEmail(
        user.email,
        "Verify Your Email",
        `Your verification token has expired. Please use the following link to verify your email: http://localhost:4000/api/user/verify?token=${newToken}`
      );

      res
        .status(StatusCode.OK)
        .json({ message: "Your token has been expired , new verification token sent successfully" });
    } else {
      // Update the user's isVerified status
      const user = await User.findById(tokenDoc.userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.isVerified = true;
      await user.save();

      // Delete the token from the database
      await Token.deleteOne({ token });

      res.status(StatusCode.OK).json({ message: "User verified successfully" });
    }
  } catch (err: any) {
    res.status(StatusCode.BadRequest).json({ message: err.message });
  }
});

export default router;
