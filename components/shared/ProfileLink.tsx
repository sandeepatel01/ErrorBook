import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

interface ProfileLinkProps {
  imgUrl: string;
  title: string;
  href?: string;
}
const ProfileLink = ({ imgUrl, title, href }: ProfileLinkProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex-center gap-1">
        <Image src={imgUrl} width={20} height={20} alt="icon" />

        {href ? (
          <Link
            href={href}
            target="_blank"
            className="paragraph-medium text-accent-blue"
          >
            {title}
          </Link>
        ) : (
          <p className="paragraph-medium text-dark400_light700">{title}</p>
        )}
      </div>
    </Suspense>
  );
};

export default ProfileLink;
