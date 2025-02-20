import { z } from 'zod';

export const CartOutputDTO = z.object({
  _id: z.string().min(24, "El ID del carrito debe ser válido y tener 24 caracteres"), 
  products: z.array(
    z.object({
      product: z.object({
        _id: z.string().min(24, "El ID del producto debe ser válido y tener 24 caracteres"),
        title: z.string().min(3, "El título del producto debe tener al menos 3 caracteres"),
        price: z.number().positive("El precio debe ser mayor a 0"),
        category: z.string().min(3, "La categoría debe tener al menos 3 caracteres")
      }),
      quantity: z.number().int().min(1, "La cantidad debe ser al menos 1"),
      _id: z.string().min(24, "El ID de la relación entre producto y carrito debe ser válido y tener 24 caracteres")
    })
  ),
  total: z.number().positive("El total debe ser un número positivo").default(0)
});
