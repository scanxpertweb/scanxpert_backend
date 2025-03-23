import * as RoleRepostiory from "./role.repository"

export const createRole = async(name:string)=>{
    return RoleRepostiory.createRole(name)
}

export const findRole = async()=>{
    return await RoleRepostiory.findRole()
}


export const updateRole = async(id: string, name:string)=>{
    return await RoleRepostiory.updateRole(id, name)
}