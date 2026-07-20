import Link from "next/link";
import {
  Card,
  CardImage,
  CardContent,
  CardTitle,
  CardSubtitle,
} from "@/shared/ui/components/Card";

interface LanguageCardProps {
  data: any;
}

export function LanguageCard({ data }: LanguageCardProps) {
  return (
    <Link href={"/discover/languages/" + (data.id || data.slug || data)}>
      <Card>
        <CardImage
          src={"/covers/language.png"}
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
