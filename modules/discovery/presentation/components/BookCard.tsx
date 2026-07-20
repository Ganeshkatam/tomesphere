import Link from "next/link";
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@/shared/ui/components/Card";

interface BookCardProps {
  data: any;
}

export function BookCard({ data }: BookCardProps) {
  return (
    <Link href={"/books/" + (data.id || data.slug || data)}>
      <Card>
        <CardImage
          src={data.coverUrl || "/covers/default.png"}
          alt={data.title}
          aspectRatio="aspect-[2/3]"
        />
        <CardContent>
          <CardTitle>{data.title}</CardTitle>
          {data.author && <CardSubtitle>{data.author}</CardSubtitle>}
        </CardContent>
      </Card>
    </Link>
  );
}
