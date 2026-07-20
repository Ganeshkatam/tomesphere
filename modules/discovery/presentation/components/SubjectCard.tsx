import Link from "next/link";
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@/shared/ui/components/Card";

interface SubjectCardProps {
  data: any;
}

export function SubjectCard({ data }: SubjectCardProps) {
  return (
    <Link href={"/discover/subjects/" + (data.id || data.slug || data)}>
      <Card>
        <CardImage
          src={"/covers/subject.png"}
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
