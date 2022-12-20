require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const doctorRouter = require('./routes/doctor');
const patientRouter = require('./routes/patient');
const adminRouter = require('./routes/admin');
const paymentRouter = require('./routes/payment');
const bookingRouter = require('./routes/booking');
const drQuroRouter = require('./routes/doctorQuro');
const consultation = require('./routes/consultation');

const app = express();
const port = process.env.PORT || 3700;
const mongoString = process.env.DATABASE_URL;

app.use(express.json({ limit: '10mb' }));

app.use(
    cors({
        origin: '*',
        exposedHeaders: 'x-auth-token',
    })
);

mongoose.connect(mongoString);
const db = mongoose.connection;
db.on('error', (error) => console.log('db err: ', error));
db.once('open', () => console.log('mongoose connected'));

app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/user', userRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);
app.use('/api/admin', adminRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/drQuro', drQuroRouter);
app.use('/api/consultation', consultation);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
