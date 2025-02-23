import { db } from "@/lib/prisma";

export const getRestaurantMenuCategoriesAndProductsBySlug = async (
  slug: string,
) => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      menuCategories: {
        include: { products: true },
      },
    },
  });

  return restaurant;
};
