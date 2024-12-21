// import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
// import { Badge } from "../ui/badge";
// import RenderTags from "../shared/RenderTags";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    username: string;
    picture: string;
    clerkId: string;
  };
}

const UserCard = async ({ user }: UserCardProps) => {
  // const interactedTags = await getTopInteractedTags({ userId: user._id });
  return (
    <Link
      href={`/profile/${user.clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={user.picture}
          width={100}
          height={100}
          alt="user profile image"
          className="rounded-full object-cover"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold line-clamp-1 text-dark-200 dark:text-light-900">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.username}
          </p>
        </div>

        {/* <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTags key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div> */}
      </article>
    </Link>
  );
};

export default UserCard;
