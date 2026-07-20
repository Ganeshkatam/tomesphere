import Link from "next/link";
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@/shared/ui/components/Card";

interface CollectionCardProps {
  data: any;
}

export function CollectionCard({ data }: CollectionCardProps) {
  return (
    <Link href={"/discover/collections/" + (data.id || data.slug || data)}>
      <Card>
        <CardImage
          src={data.imageUrl || "/covers/collection.png"}
          alt={data.title || data.name}
          aspectRatio="aspect-[2/3]"
        />
        <CardContent>
          <CardTitle>{data.title || data.name}</CardTitle>
          {data.description && <CardSubtitle>{data.description}</CardSubtitle>}
        </CardContent>
      </Card>
    </Link>
  );
}
