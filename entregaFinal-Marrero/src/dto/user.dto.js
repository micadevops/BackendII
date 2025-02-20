import { z } from 'zod';

const UserDTO = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(), 
    role: z.string()
});



const mapUserToDTO = (user) => {
    if (!user || !user._id || !user.first_name || !user.last_name) {
        throw new Error("El usuario no tiene todos los datos requeridos");
    }

    return UserDTO.parse({
        id: user._id.toString(),
        email: user.email || "No disponible",
        name: `${user.first_name} ${user.last_name}`,
        role: user.role || "user"
    });
};


export { UserDTO, mapUserToDTO };
