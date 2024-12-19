// import Question from "@/components/forms/Question";
// import { getQuestionById } from "@/lib/actions/question.action";
// import { getUserById } from "@/lib/actions/user.action";
// import { ParamsProps } from "@/types";
// import { auth } from "@clerk/nextjs/server";
// import React from "react";

// const Page = async ({ params }: ParamsProps) => {
//   const authResult = await auth();

//   const userId = authResult?.userId;
//   const { id: questionId } = await params;

//   if (!userId) {
//     console.error("User not authenticated");
//     return null;
//   }

//   const mongoUser = await getUserById({ userId });
//   const result = await getQuestionById({ questionId });

//   // Convert MongoDB ObjectIds to strings manually
//   const simplifiedMongoUser = {
//     ...mongoUser,
//     _id: mongoUser._id.toString(), // Convert _id (ObjectId) to string
//   };

//   // Convert the result (question details) to a simple JSON string or plain object
//   const simplifiedResult = result ? JSON.stringify(result) : undefined;

//   return (
//     <>
//       <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
//       <div className="mt-9">
//         <Question
//           type="Edit"
//           mongoUserId={simplifiedMongoUser._id}
//           questionDetails={simplifiedResult}
//         />
//       </div>
//     </>
//   );
// };

// export default Page;
