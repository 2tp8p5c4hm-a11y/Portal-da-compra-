import { prisma } from "@/lib/prisma";
import { detectPlatform, isValidAffiliateUrl } from "@/lib/detectPlatform";

export async function GET() {
  try {
    const data = await prisma.affiliateProduct.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching affiliate products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate URL
    if (!body.affiliateUrl || typeof body.affiliateUrl !== "string") {
      return Response.json(
        { error: "affiliateUrl is required and must be a string" },
        { status: 400 }
      );
    }

    if (!isValidAffiliateUrl(body.affiliateUrl)) {
      return Response.json(
        { error: "Invalid affiliate URL format" },
        { status: 400 }
      );
    }

    const platform = detectPlatform(body.affiliateUrl);

    const created = await prisma.affiliateProduct.create({
      data: {
        affiliateUrl: body.affiliateUrl,
        platform,
        title: body.title || null,
        status: "active",
      },
    });

    return Response.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
