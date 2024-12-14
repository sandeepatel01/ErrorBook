// import QuestionCard from "@/components/cards/QuestionCard";
// import NoResult from "@/components/shared/NoResult";
// import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
// import { getQuestionsByTagId } from "@/lib/actions/tag.action";
// import { IQuestion } from "@/models/question.model";
// import { URLProps } from "@/types";
// import React from "react";

// const page = async ({ params, searchParams }: URLProps) => {
//   const { id } = await params;
//   const { q } = await searchParams;

//   const result = await getQuestionsByTagId({
//     tagId: id,
//     page: 1,
//     searchQuery: q,
//   });

//   return (
//     <>
//       <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

//       <div className="mt-11 w-full">
//         <LocalSearchbar
//           route="/"
//           iconPosition="left"
//           imgSrc="/assets/icons/search.svg"
//           placeholder="Search  tag questions..."
//           otherClasses="flex-1"
//         />
//       </div>

//       <div className="mt-10 flex w-full flex-col gap-6">
//         {result.questions.length > 0 ? (
//           result.questions.map((question: IQuestion) => (
//             <QuestionCard
//               key={question._id}
//               _id={question._id}
//               title={question.title}
//               tags={question.tags}
//               author={question.author}
//               views={question.views}
//               upvotes={question.upvotes}
//               answers={question.answers}
//               createdAt={question.createdAt}
//             />
//           ))
//         ) : (
//           <NoResult
//             title="There's no tag question saved to show"
//             description="Be the first to ask a question"
//             link="/ask-question"
//             linkTitle="Ask a Question"
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default page;
