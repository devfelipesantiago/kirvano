import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import userService from '../services/user.service';

async function register(req: Request, res: Response) {
  const serviceResponse = await userService.registerUser(req.body);

  if (serviceResponse.status !== 'SUCCESSFUL') {
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
  res.status(201).json(serviceResponse.data);
}

async function getProfiles(_req: Request, res: Response) {
  const serviceResponse = await userService.getProfiles();

  if (serviceResponse.status !== 'SUCCESSFUL') {
    return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
  res.status(200).json(serviceResponse.data);
}

export default {
  register,
  getProfiles,
};