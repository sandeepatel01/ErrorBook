import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.action";
import RightSidebar from "./shared/RightSidebar";

export default async function SidebarContainer() {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getTopPopularTags();

  return <RightSidebar hotQuestions={hotQuestions} popularTags={popularTags} />;
}
