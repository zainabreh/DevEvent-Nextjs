import { IEvent } from './../../../../models/Event';
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/Event";
// Interface for route parameters
interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by slug
 *
 * @param req - Next.js request object
 * @param params - Route parameters containing the slug
 * @returns Event document as JSON or error response
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<{ event?: IEvent; message: string }>> {
  try {
    // Validate slug parameter
    const { slug } = params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 },
      );
    }

    // Normalize and validate slug format (alphanumeric, hyphens, underscores)
    const normalizedSlug = slug.toLowerCase().trim();
    const slugRegex = /^[a-z0-9_-]+$/;

    if (!slugRegex.test(normalizedSlug)) {
      return NextResponse.json(
        { message: "Invalid slug format" },
        { status: 400 },
      );
    }

    // Connect to database
    await connectToDatabase();

    // Query event by slug
    const event = await Event.findOne({ slug: normalizedSlug });

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { event, message: "Event retrieved successfully" },
      { status: 200 },
    );
  } catch (error) {
    // Log error for debugging (in production, use a proper logging service)
    console.error("Error fetching event:", error);

    // Handle unexpected errors
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    if (errorMessage.includes("CastError")) {
      return NextResponse.json(
        { message: "Invalid event identifier" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to fetch event. Please try again later." },
      { status: 500 },
    );
  }
}
