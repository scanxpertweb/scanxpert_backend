import * as RoleService from "./role.services"
import { Request, Response } from "express";

export const createRole = async(req: Request, res: Response)=>{
    try{
       const {name} = req.body as unknown as { name: string };
       const result = await RoleService.createRole(name);
       res.status(201).json(result);
    }catch(err){
       res.status(500).json(err);
    }
}

export const findAllRole = async(req: Request, res: Response)=>{
      try{
         const result = await RoleService.findRole();
         res.status(200).json(result);
      }catch(err){
         res.status(500).json(err);
      }
   }


export const updateRole = async(req: Request, res: Response)=>{
    try{
        const {id} = req.params;
        const {name} = req.body as unknown as { name: string };
        const result = await RoleService.updateRole(id, name);
        res.status(200).json(result);
    }catch(err){
        res.status(500).json(err);
    }
}   