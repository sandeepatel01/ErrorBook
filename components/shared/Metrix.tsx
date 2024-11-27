import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MetrixProps {
  imgUrl: string;
  alt: string;
  title: string;
  value: string | number;
  href?: string;
  textStyle?: string;
  isAuthor?: boolean;
}

const Metrix = ({
  imgUrl,
  alt,
  title,
  value,
  href,
  textStyle,
  isAuthor,
}: MetrixProps) => {
  const metrixContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyle} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {metrixContent}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{metrixContent}</div>;
};

export default Metrix;
