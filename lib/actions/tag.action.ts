"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../dbConnect";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/models/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  await connectToDatabase();

  try {
    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // TODO: Find interactions for the user and group by tags...
    // TODO: Interaction...

    return [
      { _id: "1", name: "Tag 1" },
      { _id: "2", name: "Tag 2" },
    ];
  } catch (error) {
    console.log("Error in getting top interacted tags: ", error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  await connectToDatabase();

  try {
    const tags = await Tag.find({}).sort({ createdAt: -1 });

    return { tags };
  } catch (error) {
    console.log("Error in getting all tags: ", error);
    throw error;
  }
}
