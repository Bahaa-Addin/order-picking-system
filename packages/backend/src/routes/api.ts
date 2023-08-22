import { Router } from 'express';
import orderRouter from './OrderRoutes';
import pickerRouter from './PickerRoutes';
import cartRouter from './CartRoutes';
import itemRouter from './ItemRoutes';

const apiRouter = Router();

apiRouter.use('/orders', orderRouter);
apiRouter.use('/pickers', pickerRouter);
apiRouter.use('/carts', cartRouter);
apiRouter.use('/items', itemRouter);


export default apiRouter;
