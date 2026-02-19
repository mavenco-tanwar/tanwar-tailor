import mongoose, { Schema, Document } from "mongoose";
import { isValidIndianMobile } from "@/lib/validation";

export interface IReview extends Document {
    name: string;
    phone: string;
    rating: number;
    message: string;
    isApproved: boolean;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        validate: {
            validator: isValidIndianMobile,
            message: (props: any) => `${props.value} is not a valid Indian mobile number!`
        }
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5,
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
