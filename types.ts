import {ObjectId, OptionalId } from "mongodb";

export type personasModelo= OptionalId <{
    nombre: string;
    email: string;
    telefono: number;
    amigos: ObjectId[];
}>
export type persona = {
    id: string;
    nombre: string;
    email: string;
    telefono: number;
    amigos: persona[];
}