import { Router } from 'express';
import { UserController } from '../controller';

const router = Router();
const {
  callUssd
} = UserController;

router.post('/', callUssd);

export default router;
