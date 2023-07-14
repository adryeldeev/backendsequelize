const express = require('express');
const UserController = require('./controllers/UserController.js');
const AddresController = require('./controllers/AddresController.js')
const authMiddleware = require('./middlewares/auth.js')

const routes = express.Router();



routes.get('/', authMiddleware, UserController.index);
routes.post('/user/create', UserController.store);
routes.put('/user/update/:id', UserController.update);
routes.delete('/user/delete/:id', UserController.delete);
routes.post('/login', UserController.login);
routes.get('/adminCount', UserController.getAdminCount);
routes.get('/dashboard', UserController.getDashboard);
routes.get('/logout', UserController.logout);



routes.use(authMiddleware);



routes.get('/user/:userId/addres', AddresController.index)
routes.post('/user/:userId/addres/create', AddresController.store);
routes.put('/addres/edit/:id', AddresController.update);
routes.delete('/addres/delete/:id', AddresController.delete);
routes.post('/addres/employeelogin', AddresController.employeelogin);
routes.get('/addres/get/:id', AddresController.getById);
routes.get('/addres/employeeCount', AddresController.getEmployeeCount);
routes.get('/addres/getEmployee', AddresController.getEmployee);
routes.get('/addres/salario', AddresController.getSalario);



module.exports = routes;