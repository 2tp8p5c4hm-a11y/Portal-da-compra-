import { prisma } from "../lib/prisma";
import { detectPlatform } from "../lib/detectPlatform";

async function main() {
  const links = [
    "https://meli.la/132veRo",
    "https://meli.la/1P37xhE",
    "https://meli.la/1iwk9RV",
    "https://s.shopee.com.br/60PYewBSom",
    "https://s.shopee.com.br/9AMXVMyFwC",
    "https://s.shopee.com.br/3qL7EGGOms",
    "https://s.shopee.com.br/gO7mjEsTD",
    "https://s.shopee.com.br/20tVNEUWIT",
  ];

  for (const url of links) {
    const platform = detectPlatform(url);

    await prisma.affiliateProduct.create({
      data: {
        platform,
        affiliateUrl: url,
        status: "active",
      },
    });
  }

  console.log("Seed finalizado");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
