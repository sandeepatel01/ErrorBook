import { formatNumber } from "@/lib/utils";
import { BadgeCounts } from "@/types";
import Image from "next/image";
import React, { Suspense } from "react";

interface StatsCardProps {
  imgUrl: string;
  title: string;
  value: number;
}

const StatsCard = ({ imgUrl, title, value }: StatsCardProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-xl border p-6 shadow-light-300 dark:shadow-dark-200">
        <Image src={imgUrl} alt={title} width={40} height={50} />
        <div>
          <p className="paragraph-semibold text-dark200_light900">{value}</p>
          <p className="body-medium text-dark400_light700">{title}</p>
        </div>
      </div>
    </Suspense>
  );
};

interface StatsProps {
  totalQuestions: number;
  totalAnswers: number;
  badges: BadgeCounts;
  reputation: number;
}

const Stats = ({
  totalQuestions,
  totalAnswers,
  badges,
  reputation,
}: StatsProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mt-10">
        <h4 className="h3-semibold text-dark200_light900">Stats</h4>
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-xl border p-6 shadow-light-300 dark:shadow-dark-200">
            <div>
              <p className="paragraph-semibold text-dark200_light900">
                {formatNumber(totalQuestions)}
              </p>
              <p className="body-medium text-dark400_light700">Questions</p>
            </div>
            <div>
              <p className="paragraph-semibold text-dark200_light900">
                {formatNumber(totalAnswers)}
              </p>
              <p className="body-medium text-dark400_light700">Answers</p>
            </div>
          </div>

          <StatsCard
            imgUrl="/assets/icons/gold-medal.svg"
            title="Gold Medal"
            value={badges.GOLD}
          />
          <StatsCard
            imgUrl="/assets/icons/silver-medal.svg"
            title="Silver Medal"
            value={badges.SILVER}
          />
          <StatsCard
            imgUrl="/assets/icons/bronze-medal.svg"
            title="Bronze Medal"
            value={badges.BRONZE}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default Stats;
