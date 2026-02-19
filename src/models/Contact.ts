import mongoose, { Schema, Document, Model } from "mongoose";
import { isValidIndianMobile } from "@/lib/validation";

export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const ContactSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: isValidIndianMobile,
            message: (props: any) => `${props.value} is not a valid Indian mobile number!`
        }
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during hot reload
const Contact: Model<IContact> =
    mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
