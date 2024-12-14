"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "../dbConnect";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/models/tag.model";
import Question from "@/models/question.model";
import { FilterQuery } from "mongoose";

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

    // Serialize _id
    const serializedTags = tags.map((tag) => ({
      ...tag.toObject(),
      _id: tag._id.toString(), // Convert ObjectId to string
    }));
    console.log("Serialized tags: ", serializedTags);

    return { tags: serializedTags };
  } catch (error) {
    console.log("Error in getting all tags: ", error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  await connectToDatabase();

  try {
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: "questions",
        model: Question,
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: "i" } }
          : {},
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "author", model: User, select: "_id clerkId name picture" },
          { path: "tags", model: Tag, select: "_id name" },
        ],
      })
      .lean();

    if (!tag) {
      throw new Error("Tag not found");
    }

    // TypeScript ko `tag` ke type ka pata chalne dena
    if (Array.isArray(tag)) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log("Error in getting questions by tag id: ", error);
    throw error;
  }
}

export async function getTopPopularTags() {
  await connectToDatabase();

  try {
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    // Manually convert _id from ObjectId to string to avoid serialization issues
    const plainTags = popularTags.map((tag) => {
      return {
        _id: tag._id.toString(), // Convert _id to string
        name: tag.name,
        numberOfQuestions: tag.numberOfQuestions,
      };
    });

    return plainTags;
  } catch (error) {
    console.log("Error in getting top popular tags: ", error);
    throw error;
  }
}
