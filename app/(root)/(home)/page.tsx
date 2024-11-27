import Link from "next/link";
import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

export default function Home() {
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
        Filters
      </div>
    </>
  );
}

// "use client";

// import { UserButton } from "@clerk/nextjs";
// const DotIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 512 512"
//       fill="currentColor"
//     >
//       <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
//     </svg>
//   );
// };

// const CustomPage = () => {
//   return (
//     <div>
//       <h1>Custom Profile Page</h1>
//       <p>This is the custom profile page</p>
//     </div>
//   );
// };
