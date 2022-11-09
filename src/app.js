import  express  from 'express';
import config from './config';
import cors from 'cors'

import usersRoutes from './routes/users.routes'
import structuresRoutes from './routes/structures.routes'
import cartRoutes from './routes/cart.routes'

const app = express();

app.set('port', config.port);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(usersRoutes);
app.use(structuresRoutes);
app.use(cartRoutes);



export default app;