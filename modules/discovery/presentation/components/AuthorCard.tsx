import Link from "next/link";
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@/shared/ui/components/Card";

interface AuthorCardProps {
  data: any;
}

export function AuthorCard({ data }: AuthorCardProps) {
  return (
    <Link href={"/discover/authors/" + (data.id || data.slug || data)}>
      <Card>
        <CardImage
          src={data.avatarUrl || "/covers/author.png"}
          alt={data.name || data}
          aspectRatio="aspect-square rounded-full"
        />
        <CardContent>
          <CardTitle>{data.name || data}</CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
