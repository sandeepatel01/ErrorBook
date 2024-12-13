"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../dbConnect";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/models/question.model";
import { FilterQuery } from "mongoose";
import Tag from "@/models/tag.model";
import Answer from "@/models/answer.model";

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
    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id",
    // );

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

export async function getAllUsers(params: GetAllUsersParams) {
  await connectToDatabase();

  try {
    // TODO: const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });

    return { users };
  } catch (error) {
    console.log("Error in getting all users: ", error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  await connectToDatabase();

  try {
    const { questionId, userId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      // remove question from saved questions
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true },
      );
    } else {
      // add question to saved questions
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true },
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log("Error in toggling save question:", error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  await connectToDatabase();

  try {
    const { clerkId, page = 1, pageSize = 20, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId })
      .populate({
        path: "saved",
        match: query,
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "author", model: User, select: "_id clerkId name picture" },
          { path: "tags", model: Tag, select: "_id name" },
        ],
      })
      .lean();

    if (!user) {
      throw new Error("User not found");
    }

    // TypeScript ko `user` ke type ka pata chalne dena
    if (Array.isArray(user)) {
      throw new Error("User data is an array, expected a single user object");
    }

    // const savedQuestions = user.saved;
    // Map saved questions to convert _id (Buffer) to string
    const savedQuestions = user.saved.map((question: any) => ({
      ...question,
      _id: question._id.toString(), // Convert _id to string
      author: question.author
        ? {
            ...question.author,
            _id: question.author._id.toString(),
          }
        : null,
      tags: question.tags.map((tag: any) => ({
        _id: tag._id.toString(), // Include both _id and name
        name: tag.name,
      })),
    }));

    return { questions: savedQuestions }; // Make sure this return statement is here
  } catch (error) {
    console.log("Error in getting saved questions: ", error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  await connectToDatabase();

  try {
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log("Error in getting user info: ", error);
    throw error;
  }
}
