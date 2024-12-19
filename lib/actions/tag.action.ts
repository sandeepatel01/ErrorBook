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
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    let sortOptions: { [key: string]: 1 | -1 } = {};

    const query: FilterQuery<ITag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;

      case "recent":
        sortOptions = { createdAt: -1 };
        break;

      case "name":
        sortOptions = { name: -1 };
        break;

      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Serialize _id
    const serializedTags = tags.map((tag) => ({
      ...tag.toObject(),
      _id: tag._id.toString(), // Convert ObjectId to string
    }));
    // console.log("Serialized tags: ", serializedTags);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + pageSize;

    return { tags: serializedTags, isNext };
  } catch (error) {
    console.log("Error in getting all tags: ", error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  await connectToDatabase();

  try {
    const { tagId, page = 1, pageSize = 2, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter)
      .populate({
        path: "questions",
        model: Question,
        match: searchQuery
          ? { title: { $regex: searchQuery, $options: "i" } }
          : {},
        options: {
          sort: { createdAt: -1 },
          skip: skipAmount,
          limit: pageSize + 1,
        },
        populate: [
          { path: "author", model: User, select: "_id clerkId name picture" },
          { path: "tags", model: Tag, select: "_id name" },
        ],
      })
      .lean();

    if (!tag) {
      throw new Error("Tag not found");
    }

    // // TypeScript ko `tag` ke type ka pata chalne dena
    if (Array.isArray(tag)) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    // Convert the questions to plain objects using .map() and handle nested fields
    // const questions = tag.questions.map((question: any) => {
    //   // Convert the question and subfields to plain objects
    //   const plainQuestion = question.toObject ? question.toObject() : question;

    //   // Convert ObjectId to string if needed
    //   plainQuestion._id = plainQuestion._id.toString();

    //   if (plainQuestion.author && plainQuestion.author._id) {
    //     plainQuestion.author._id = plainQuestion.author._id.toString();
    //   }

    //   if (Array.isArray(plainQuestion.tags)) {
    //     plainQuestion.tags = plainQuestion.tags.map((tag: any) => ({
    //       _id: tag._id.toString(),
    //       name: tag.name,
    //     }));
    //   }

    //   if (plainQuestion.createdAt instanceof Date) {
    //     plainQuestion.createdAt = plainQuestion.createdAt.toISOString();
    //   }

    //   // Manually convert Buffer fields to strings (if any)
    //   if (Buffer.isBuffer(plainQuestion.someField)) {
    //     plainQuestion.someField = plainQuestion.someField.toString("utf-8");
    //   }

    //   return plainQuestion;
    // });

    const isNext = tag.questions.length > pageSize;

    return { tagTitle: tag.name, questions, isNext };
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
