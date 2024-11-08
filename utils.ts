import type  { Collection } from "mongodb";
import type { personasModelo,persona } from "./types.ts";

export const deModeloAPersona = async(
    modelo: personasModelo,
    coleccionPersonas: Collection<personasModelo>,): Promise<persona> => {
        const amigos = await coleccionPersonas.find({_id: { $in: modelo.amigos}}).toArray();

        return {
            id: modelo._id!.toString(),
            nombre: modelo.nombre,
            email: modelo.email,
            telefono: modelo.telefono,
            amigos: amigos.map((a) =>({
                id: a._id.toString(),
                nombre: a.nombre,
                email: a.email,
                telefono: a.telefono,
                amigos: [],

            })),
        };
    };