import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";


const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    
    },
    isVerified: { type: Boolean, default: false },
    googleId: { type: String },
    displayName: { type: String }
});

// Define the User document interface
export interface UserDocument extends Document {
    email: string;
    password?: string;
    isVerified: boolean;
    signUp(email: string, password: string): Promise<UserDocument>;
    generateVerificationToken: () => Promise<string>;
    googleId?: string;
    displayName?: string;
}

// Define the User model interface
interface UserModel extends Model<UserDocument> {
    [x: string]: any;
    logIn(email: string, password: string): Promise<UserDocument>;
    signUp(email: string, password: string): Promise<UserDocument>;
}

// Define the static method for signing up a new user
userSchema.statics.signUp = async function(email: string, password: string): Promise<UserDocument> {
    // Validate email and password
    if (!email || !password){
        throw new Error("All fields must be filled");
    }

    if (!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }

    if (!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }

    // Check if user already exists
    const user = await this.findOne({ email });

    if (user) {
        if (user.isVerified) {
            throw new Error("User already exists");
        } else {
            // Handle the case where the user exists but is not verified yet
            throw new Error("User is not verified yet");
        }
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return this.create({ email, password: hash });
};


// Define the static method for log in 
userSchema.statics.logIn = async function(email: string, password: string): Promise<UserDocument> {
    const user = await this.findOne({ email });

    

    if (!user) {
        throw new Error("User does not exist");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw new Error("Invalid password");
    }

    if (user.isVerified == false) {
        throw new Error("User is not verified , please verify before logging in");
    }
    return user;
};

// Create the User model
const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;

