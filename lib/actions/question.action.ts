"user server";

import { connectToDatabase } from "../dbConnect";

export async function createQuestion(params: any) {
  await connectToDatabase();
  try {
    // Your logic for creating a question
    // Add your code here
  } catch (error) {
    console.log("Error in creating question:", error);
  }
}
