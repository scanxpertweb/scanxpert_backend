import express, { Request, Response } from 'express';
import * as AuthController from './auth.controllers';
import { reportUpload } from '../utils/multer';

const router = express.Router();

router.post('/verify-token', (req: Request, res: Response) => {
    AuthController.verifyIdToken(req, res);
  });
  
  router.post('/register',reportUpload.array('report', 5), (req: Request, res: Response) => {
    AuthController.registerUser(req, res);
  });
  router.post('/check-user', (req: Request, res: Response) => {
    AuthController.checkUserExists(req, res);
  });

  router.get('/list', (req: Request, res: Response) => {
    AuthController.findAllUsers(req, res);
  });

  router.get('/user/:id', (req: Request, res: Response) => {
    AuthController.findUserById(req, res);
  });


  router.patch("/user/:id", (req: Request, res: Response) => {
    AuthController.updateUserById(req, res);
  }
  );


  router.post('/report/:id',reportUpload.array('report', 5), (req: Request, res: Response) => {
    AuthController.uploadReportFile(req, res);
  });

  router.post('/delete/:id', (req: Request, res: Response) => {
    AuthController.deleteReport(req, res);
  }
  );

  router.delete('/user/:id', (req: Request, res: Response) => {
    AuthController.deleteUserById(req,
      res);
  }
  );


   
export default router;
