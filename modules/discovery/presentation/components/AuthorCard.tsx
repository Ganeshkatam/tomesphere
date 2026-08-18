import Link from "next/link";
import { User } from "lucide-react";
import { AuthorCardDto } from "../../application/dto/AuthorCardDto";

interface AuthorCardProps {
  author: AuthorCardDto;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link
      href={`/discover/authors/${author.slug}`}
      className="group flex flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-lg p-2"
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 bg-surface-variant/30 rounded-full shadow-sm overflow-hidden transition-transform duration-200 group-hover:-translate-y-[2px] group-hover:shadow-md flex items-center justify-center">
        {author.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={author.imageUrl}
            alt={`Portrait of ${author.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <User className="w-10 h-10 md:w-12 md:h-12 text-on-surface-variant/50" />
        )}
      </div>
      <h4 className="font-serif text-title-md text-on-surface line-clamp-2 transition-colors duration-200 group-hover:text-primary">
        {author.name}
      </h4>
      <p className="text-body-sm text-on-surface-variant mt-1">
        {author.bookCount} {author.bookCount === 1 ? 'book' : 'books'}
      </p>
    </Link>
  );
}
