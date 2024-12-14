// import React from "react";
// import { getUserAnswers } from "@/lib/actions/user.action";
// import AnswerCard from "../cards/AnswerCard";

// interface AnswerTabProps {
//   userId: string;
//   clerkId?: string | null;
//   searchParams: { [key: string]: string | string[] | undefined };
// }

// const AnswerTab = async ({ userId, clerkId, searchParams }: AnswerTabProps) => {
//   const result = await getUserAnswers({ userId, page: 1 });
//   return (
//     <>
//       {result.answers.map((item) => (
//         <AnswerCard
//           key={item._id}
//           _id={item._id}
//           clerkId={clerkId}
//           author={item.author}
//           upvotes={item.upvotes.length}
//           question={item.question}
//           createdAt={item.createdAt}
//         />
//       ))}
//     </>
//   );
// };

// export default AnswerTab;
