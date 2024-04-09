import { Document, model, Schema } from "mongoose";

// Define the verification token schema
const verificationTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

// Define the VerificationTokenDocument type based on the verification token schema
interface VerificationTokenDocument extends Document {
    userId: string;
    token: string;
    expiresAt: Date ;
}

// Create the VerificationToken model based on the verification token schema
const VerificationToken = model<VerificationTokenDocument>("VerificationToken", verificationTokenSchema);

export default VerificationToken;
