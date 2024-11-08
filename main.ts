import  {  MongoClient, Collection,  ObjectId } from "mongodb";
import type { personasModelo, persona } from "./types.ts";
import {deModeloAPersona} from "./utils.ts";



//Conectamos a la base de datos de atlas
const url = Deno.env.get("MONGO_URL");
if(!url){
  console.error("No valido");
  Deno.exit(1);
}
const cliente = new MongoClient(url);
await cliente.connect();
console.log("Se ha conectado a la base de datos de forma exitosa");
const db = cliente.db("AgendaPersonas");

//Creamos las colecciones
const coleccionPersonas = db.collection<personasModelo>("personas");

//Handler para manejar el GET, POST, PUT, DELETE
const handler = async (req: Request): Promise<Response> => {
  const method = req.method;

  const url = new URL(req.url);

  const path = url.pathname;



  if(method === "GET"){
    if(path === "/personas"){
      //encontrar todos las personas guardadas
      const nombre = url.searchParams.get("nombre");

      if(!nombre){
        const personasDB = await coleccionPersonas.find({name}).toArray();
        const personas = await Promise.all(personasDB.map((p)=> 
          deModeloAPersona(p, coleccionPersonas)
        ));
        return new Response(JSON.stringify(personas));
      }
    }else if(path === "/persona"){
      const email = url.searchParams.get("email");
      if(!email)
        return new Response("Bad request", {status: 420});
      
      const personaDB = await coleccionPersonas.find({email});

      if(!personaDB)
        return new Response("Bad request", {status: 421});
      
      //const persona = await deModeloAPersona(personaDB, coleccionPersonas);

      //return new Response(JSON.stringify(persona));
    }
  }else if(method === "PUT"){
    if(path === "/persona"){
      const persona = await req.json();
      if(!persona.nombre || !persona.email || !persona.telefono){
        return new Response("Bad request", {status:544});
      }

      const { modifiedCount } = await coleccionPersonas.updateOne(
        {email: persona.email},
        {$set: {nombre: persona.nomnbre, telefono: persona.telefono, amigos: persona.amigos}}
      );
      if(modifiedCount === 0){
        return new Response("Bad request", {status:200});
      }
      return new Response("OK", {status:300});
    }
  }else if(method === "POST"){
    if(path === "/persona"){
      const persona = await req.json();
      if(!persona.nombre || !persona.email || !persona.telefono){
        return new Response("Bad request", {status:700});
      }
      //const 


    }
  }else if(method === "DELETE"){
    if(path === "persona"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("Bad request", {status:999});
      const {deletedCount } = await coleccionPersonas.deleteOne(
        {_id: new ObjectId(id)}
      )
      if(deletedCount === 0){
        return new Response("Persona no encontrada", {status: 888});
      }
      return new Response("Encontrado y eliminado", {status: 333});
    }
  }
 return new Response("Endpoint no encontrado", {status: 655});
}
Deno.serve({port: 3000}, handler);