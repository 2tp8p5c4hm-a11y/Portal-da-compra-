import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json();

    if (!params.id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.affiliateProduct.update({
      where: { id: params.id },
      data: body,
    });

    return Response.json(updated);
  } catch (error) {
    console.error("Error updating affiliate product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    if (!params.id) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.affiliateProduct.delete({
      where: { id: params.id },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error deleting affiliate product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
