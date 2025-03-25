import * as RoleController from "./role.controllers"
import express, {Request, Response} from 'express'

const router = express.Router()

router.post('/add',(req: Request, res: Response) => {
    RoleController.createRole(req, res);
  });

router.get('/all',(req: Request, res: Response) => {
    RoleController.findAllRole(req, res);
  }
);

router.patch('/update/:id',(req: Request, res: Response) => {
    RoleController.updateRole(req, res);
  }
);



export default router;