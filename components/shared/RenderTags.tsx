"use client";

import React, { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface RenderTagsProps {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTags = ({
  _id,
  name,
  totalQuestions,
  showCount,
}: RenderTagsProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Link href={`/tags/${_id}`} className="flex justify-between gap-2">
        <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-xl border-none px-4 py-2 uppercase">
          {name}
        </Badge>
        {showCount && (
          <p className="small-medium text-dark500_light700">{totalQuestions}</p>
        )}
      </Link>
    </Suspense>
  );
};

export default RenderTags;
