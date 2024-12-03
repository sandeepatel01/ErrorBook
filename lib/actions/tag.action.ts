"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../dbConnect";
import { GetTopInteractedTagsParams } from "./shared.types";

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
