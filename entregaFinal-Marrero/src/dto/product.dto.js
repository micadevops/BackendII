import { z } from "zod";

export const createProductDTO = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  code: z.string().min(3, "El código debe tener al menos 3 caracteres"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  category: z.string().min(3, "La categoría debe tener al menos 3 caracteres"),
  thumbnails: z.array(z.string()).optional(),
});


export const getProductDTO = (product) => {
    return {
      id: product._id ? product._id.toString() : undefined,
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails> 0 ? product.thumbnails : undefined,
    };
};

  