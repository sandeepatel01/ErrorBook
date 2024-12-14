// import { getUserQuestions } from "@/lib/actions/user.action";
// import React from "react";
// import QuestionCard from "../cards/QuestionCard";

// interface QuestionTabProps {
//   userId: string;
//   clerkId?: string | null;
//   searchParams: { [key: string]: string | string[] | undefined };
// }

// const QuestionTab = async ({
//   searchParams,
//   userId,
//   clerkId,
// }: QuestionTabProps) => {
//   const result = await getUserQuestions({
//     userId,
//     page: 1,
//   });
//   return (
//     <>
//       {result.questions.map((item) => (
//         <QuestionCard
//           key={item._id}
//           _id={item._id}
//           clerkId={clerkId}
//           title={item.title}
//           tags={item.tags}
//           author={item.author}
//           views={item.views}
//           upvotes={item.upvotes}
//           answers={item.answers}
//           createdAt={item.createdAt}
//         />
//       ))}
//     </>
//   );
// };

// export default QuestionTab;
