import mongoose from "mongoose";

interface PasswordResetAttributes {
  userId: string;
  secretKey: string;
  expiresAt: Date;
}

interface PasswordResetDocumnet extends mongoose.Document {
  id: string;
  userId: string;
  secretKey: string;
  expiresAt: Date;
}

interface PasswordResetModel extends mongoose.Model<PasswordResetDocumnet> {
  build(
    passwordResetAttributes: PasswordResetAttributes
  ): PasswordResetDocumnet;

  getPasswordResetBySecretKey(
    secretKey: string
  ): Promise<PasswordResetDocumnet | undefined>;
}

const passwordResetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  secretKey: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
});

passwordResetSchema.statics.build = (
  passwordResetAttributes: PasswordResetAttributes
) => {
  return new PasswordReset(passwordResetAttributes);
};

passwordResetSchema.statics.getPasswordResetBySecretKey = async (
  secretKey: string
) => {
  const passwordReset = await PasswordReset.findOne({
    secretKey: secretKey,
  });
  if (passwordReset && passwordReset.expiresAt.getTime() > Date.now()) {
    return passwordReset;
  }
  return undefined;
};

const PasswordReset = mongoose.model<PasswordResetDocumnet, PasswordResetModel>(
  "PasswordReset",
  passwordResetSchema
);

export { PasswordReset };
