import mongoose from "mongoose";
import { EncryptionHelper } from "../helpers/encryption-helper";

interface NoteAttributes {
  title: string;
  body: string;
  userId: string;
}

interface NoteDocument extends mongoose.Document {
  id: string;
  title: string;
  body: string;
  userId: string;
  iv: string;
}

interface NoteModel extends mongoose.Model<NoteDocument> {
  build(noteAttributes: NoteAttributes): NoteDocument;
}

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        // ret.body = EncryptionHelper.decrypt({ iv: ret.iv, content: ret.body });
        delete ret._id;
        delete ret.__v;
        delete ret.iv;
      },
    },
  }
);

noteSchema.statics.build = (noteAttributes: NoteAttributes) => {
  return new Note(noteAttributes);
};

noteSchema.pre("save", function () {
  if (this.isModified("body")) {
    const encryptionInfo = EncryptionHelper.encrypt(this.get("body"));
    this.set("body", encryptionInfo.content);
    this.set("iv", encryptionInfo.iv);
  }
});

const Note = mongoose.model<NoteDocument, NoteModel>("Note", noteSchema);

export { Note, NoteDocument };
