"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../dbConnect";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import console, { error } from "console";
import Question from "@/models/question.model";

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

export async function createUser(userParams: CreateUserParams) {
  await connectToDatabase();

  try {
    const newUser = await User.create(userParams);
    return newUser;
  } catch (error) {
    console.log("Error creating user: ", error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  await connectToDatabase();

  try {
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log("Error in user updation: ", error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  await connectToDatabase();

  try {
    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id",
    );

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log("Error in deleting user: ", error);
    throw error;
  }
}
