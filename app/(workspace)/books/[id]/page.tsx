import BookDetailScreen from "@/modules/books/presentation/screens/BookDetailScreen";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <BookDetailScreen params={params} />;
}
