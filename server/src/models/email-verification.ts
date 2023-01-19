import mongoose from "mongoose";

interface EmailVerificationAttributes {
  secretKey: string;
  completed?: boolean;
}

export interface EmailVerificationDocumnet extends mongoose.Document {
  id: string;
  secretKey: string;
  completed: boolean;
}

interface EmailVerificationModel
  extends mongoose.Model<EmailVerificationDocumnet> {
  build(
    emailVerificationAttributes: EmailVerificationAttributes
  ): EmailVerificationDocumnet;

  getEmailVerificationBySecretKey(
    secretKey: string
  ): Promise<EmailVerificationDocumnet | undefined>;
}

const emailVerificationSchema = new mongoose.Schema({
  secretKey: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: false,
    default: false,
  },
});

emailVerificationSchema.statics.build = (
  emailVerificationAttributes: EmailVerificationAttributes
) => {
  return new EmailVerification(emailVerificationAttributes);
};

emailVerificationSchema.statics.getEmailVerificationBySecretKey = async (
  secretKey: string
) => {
  const emailVerification = await EmailVerification.findOne({
    secretKey: secretKey,
  });
  if (emailVerification && !emailVerification.completed) {
    return emailVerification;
  }
  return undefined;
};

const EmailVerification = mongoose.model<
  EmailVerificationDocumnet,
  EmailVerificationModel
>("EmailVerification", emailVerificationSchema);

export { EmailVerification };
