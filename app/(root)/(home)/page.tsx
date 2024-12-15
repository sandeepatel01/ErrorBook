import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";

export default async function Home({ searchParams }: SearchParamsProps) {
  const queryObj = await Promise.resolve(searchParams ?? {});
  const searchQuery = queryObj.q || "";

  // console.log("Search query: ", searchQuery);

  const result = await getQuestions({
    searchQuery,
    filter: queryObj.filter || "",
  });

  const questions = result?.questions || [];

  // TODO: fetch Recommended questions

  // console.log(result);
  // console.log(result.questions);

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="justify-endmax-sm:w-full flex">
          <Button className="primary-gradient min-h-[46px] rounded-xl px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search  for questions..."
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w[170px] "
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              views={question.views}
              upvotes={question.upvotes}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to ask a question"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}

// "use client";

// import { useSearchParams } from "next/navigation"; // To get search query from URL
// import { useEffect, useState } from "react";
// import { getQuestions } from "@/lib/actions/question.action"; // Function to get questions
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
// import Filter from "@/components/shared/Filter";
// import { HomePageFilters } from "@/constants/filters";
// import HomeFilters from "@/components/home/HomeFilters";
// import NoResult from "@/components/shared/NoResult";
// import QuestionCard from "@/components/cards/QuestionCard";

// export default function Home() {
//   const searchParams = useSearchParams(); // Get search parameters from URL
//   const searchQuery = searchParams.get("q") || ""; // Get the query parameter `q` (default to empty string)

//   const [questions, setQuestions] = useState<any[]>([]); // State to store fetched questions
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState<string | null>(null); // Error state

//   // Fetch questions whenever search query changes
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       setLoading(true); // Set loading to true
//       try {
//         const result = await getQuestions({
//           searchQuery, // Pass search query to fetch questions
//         });

//         setQuestions(result?.questions || []); // Set the fetched questions
//       } catch (err) {
//         setError("Failed to fetch questions"); // Handle error
//       } finally {
//         setLoading(false); // Set loading to false
//       }
//     };

//     fetchQuestions(); // Trigger fetch when `searchQuery` changes
//   }, [searchQuery]); // Dependency array listens to changes in `searchQuery`

//   return (
//     <>
//       <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
//         <h1 className="h1-bold text-dark100_light900">All Questions</h1>
//         <Link href="/ask-question" className="justify-endmax-sm:w-full flex">
//           <Button className="primary-gradient min-h-[46px] rounded-xl px-4 py-3 !text-light-900">
//             Ask a Question
//           </Button>
//         </Link>
//       </div>

//       <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
//         <LocalSearchbar
//           route="/"
//           iconPosition="left"
//           imgSrc="/assets/icons/search.svg"
//           placeholder="Search for questions..."
//           otherClasses="flex-1"
//         />

//         <Filter
//           filters={HomePageFilters}
//           otherClasses="min-h-[56px] sm:min-w[170px] "
//           containerClasses="hidden max-md:flex"
//         />
//       </div>

//       <HomeFilters />

//       <div className="mt-10 flex w-full flex-col gap-6">
//         {loading ? (
//           <div>Loading...</div> // Show loading indicator
//         ) : error ? (
//           <div>{error}</div> // Show error message if fetching fails
//         ) : questions.length > 0 ? (
//           questions.map((question: any) => (
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
//             title="There's no question to show"
//             description="Be the first to ask a question"
//             link="/ask-question"
//             linkTitle="Ask a Question"
//           />
//         )}
//       </div>
//     </>
//   );
// }
