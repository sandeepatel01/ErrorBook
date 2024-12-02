"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../dbConnect";

export async function getUserById(params: any) {
  await connectToDatabase();

  try {
    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId,
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
