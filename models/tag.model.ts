import { Schema, model, models, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "QuestionModel" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "UserModel" }],
  createdAt: { type: Date, default: Date.now },
});

const TagModel = models.Tag || model<ITag>("Tag", tagSchema);

export default TagModel;
