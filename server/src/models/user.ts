import mongoose from "mongoose";
import { UserStatus } from "../constants/user-status";
import { PasswordHelper } from "../helpers/password-helper";
import { EmailVerificationDocumnet } from "./email-verification";

// Interface defining the attributes needed to create the user document
interface UserAttributes {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  status?: number;
  emailVerification?: EmailVerificationDocumnet;
}

// Interface defining the properties a user document has
export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  status: number;
  emailVerification: EmailVerificationDocumnet;
}

// Interface defining the properties a user model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(userAttributes: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    status: {
      type: Number,
      required: false,
      default: UserStatus.VerificationPending,
    },
    emailVerification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailVerification",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        // delete ret.isAdmin;
        delete ret.__v;
        delete ret.accessRevoked;
        delete ret.status;
        delete ret.emailVerification;
      },
    },
  }
);

userSchema.pre("save", function () {
  if (this.isModified("password"))
    this.set("password", PasswordHelper.hashPassword(this.get("password")));
});

userSchema.statics.build = (userAttributes: UserAttributes) => {
  return new User(userAttributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
