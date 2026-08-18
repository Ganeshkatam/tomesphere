import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/core/database/server";
import { SupabaseIdentityProvider } from "@/shared/infrastructure/identity/SupabaseIdentityProvider";
import { SupabaseBookRepository } from "@/modules/books/infrastructure/SupabaseBookRepository";
import { BookId } from "@/modules/books/domain/value-objects";
import { getBookViewerContext } from "@/modules/books/application/queries/GetBookViewerContext/handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(bookId)) {
      return NextResponse.json({ error: "Malformed Book ID" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    
    // 1. Authenticate
    const identityProvider = new SupabaseIdentityProvider(supabase);
    const user = await identityProvider.currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // 2. Authorize
    const viewerContext = await getBookViewerContext(bookId);

    // If viewer is not authorized to download, reject immediately
    if (!viewerContext.permissions.download) {
      return NextResponse.json({ error: "Unauthorized to download this resource" }, { status: 403 });
    }

    // 2. Resolve Resource
    const repository = new SupabaseBookRepository(supabase);
    const book = await repository.findById(BookId.create(bookId));

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Find the primary downloadable format (e.g. PDF)
    const primaryFile = book.files.find(f => f.isPrimary) || book.files[0];

    if (!primaryFile || !primaryFile.storagePath) {
      return NextResponse.json({ error: "No downloadable resource available" }, { status: 404 });
    }

    // 3. Generate Access (Currently redirects to public URL, but documented for future Private Bucket shift)
    // TODO: In the future, this should generate a short-lived signed URL for a private bucket:
    // const { data } = await supabase.storage.from('book-pdfs-private').createSignedUrl(primaryFile.storagePath, 60)
    // return NextResponse.redirect(data.signedUrl)
    
    const publicUrl = supabase.storage
      .from("book-pdfs")
      .getPublicUrl(primaryFile.storagePath).data.publicUrl;

    return NextResponse.redirect(publicUrl);
  } catch (error) {
    console.error("Download Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
