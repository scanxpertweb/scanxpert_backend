import express, { Request, Response } from 'express';
import * as AuthController from './auth.controllers';

const router = express.Router();

router.post('/verify-token', (req: Request, res: Response) => {
    AuthController.verifyIdToken(req, res);
  });
  
  router.post('/register', (req: Request, res: Response) => {
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


  router.post('/report/:id', (req: Request, res: Response) => {
    AuthController.uploadReportFile(req, res);
  });


   
export default router;
