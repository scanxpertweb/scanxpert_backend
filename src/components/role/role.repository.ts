import {Role} from "../collections/role"


export const createRole = async (name: string) => {
    return await Role.create({ name });
  };
  

export const findRole = async()=>{
   return await Role.find();
}

export const  updateRole = async(id:string, name:string)=>{
    return await Role.findByIdAndUpdate(id, {name}, {new:true});
}
