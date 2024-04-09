require("dotenv").config();
import axios from "axios";
import express from "express";
import { StatusCode } from "./utils/statusCode";
import User, { UserDocument } from "./db/models/user.model";
import { createToken } from "./utils/generateToken";

const routes = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URL;

// Initiates the Google Login flow
routes.get("/google/callback", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;

  res.redirect(url);
});

// Callback URL for handling the Google Login response
routes.get("/api/user/oauth/google", async (req, res) => {
  const { code } = req.query;

  console.log(code);

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });


    const { access_token, id_token } = data;
    console.log("data" , data);
    

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    // Check if user already exists in the database based on googleId
    let user = await User.findOne({ email: profile.email });
    console.log("user:" , user);
    


    if (user) {
      throw new Error(
        "Email already exists, please sign up with another account."
      );
    }
    // Create a new user if not found
    const newUser: UserDocument = new User({
      username: profile.name,
      email: profile.email,
      isVerified: true, // Assuming Google OAuth is verified
      googleId: profile.id,
    });

    // Save the new user to the database
    await newUser.save();
    console.log("User saved to database:", newUser); // Debugging statement

    // Generate JWT token for the new user and send it back
    const token = createToken(newUser._id); // Assuming _id is the MongoDB ObjectId of the user
    return res.json({ token }); // Send JWT token back to the client
  } catch (error: any) {
    console.error("Error:", error);
    res.redirect("/login"); // Redirect only in case of error
  }
});

export default routes;
