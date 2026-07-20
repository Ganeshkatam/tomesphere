import Link from "next/link";
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@/shared/ui/components/Card";

interface GenreCardProps {
  data: any;
}

export function GenreCard({ data }: GenreCardProps) {
  return (
    <Link href={"/discover/genres/" + (data.id || data.slug || data)}>
      <Card>
        <CardImage
          src={"/covers/genre.png"}
          alt={data}
          aspectRatio="aspect-[2/3]"
        />
        <CardContent>
          <CardTitle>{data}</CardTitle>
        </CardContent>
      </Card>
    </Link>
  );
}
