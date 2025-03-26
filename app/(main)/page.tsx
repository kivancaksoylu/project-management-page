import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import Tasks from "@/components/tasks";
import { getTasks } from "../api/api";

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const queryClient = new QueryClient();
  const search = (await searchParams)?.search ?? "";
  await queryClient.prefetchQuery({
    queryKey: ["tasks", { search }],
    queryFn: () => getTasks({ search }),
  });

  return (
    <div className="p-3 flex flex-col flex-1">
      <div className="flex-1 flex flex-col py-5 px-6 font-[family-name:var(--font-geist-sans)] bg-primary-foreground border border-border-default rounded-xl">
        <div className="text-2xl font-semibold m-0 leading-none flex items-center gap-3">
          <div className="flex items-center">
            <span>Projects</span>
          </div>
        </div>
        <div className="h-[2px] bg-border-default w-[calc(100%+48px)] -mx-6 mt-3 mb-3"></div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Tasks />
        </HydrationBoundary>
      </div>
    </div>
  );
}
