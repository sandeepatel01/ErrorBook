import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";

import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const queryObj = await Promise.resolve(searchParams ?? {});
  const searchQuery = queryObj.q || "";

  const result = await getAllTags({
    searchQuery,
    filter: queryObj.filter || "",
    page: queryObj?.page ? +queryObj.page : 1,
  });

  // console.log("result", result);

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search  for tags..."
          otherClasses="flex-1"
        />

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w[170px] "
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border p-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-xl px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900 capitalize">
                    {tag.name}
                  </p>
                </div>
                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No tags found"
            description="It seems like there are no tags yet. Why not be the first one to create one?"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>

      <div className="mt-10">
        <Pagination
          pageNumber={queryObj?.page ? +queryObj.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
