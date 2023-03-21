/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.post('/usuario/crear', 'UsersController.registrarUsuario')
Route.post('/usuario/login', 'UsersController.login')
Route.post('/usuario/recuperarCuenta', 'UsersController.recuperarCuenta')
Route.post('/usuario/cambiarPassword', 'UsersController.cambiarPassword')
Route.post('/usuario/logout', 'UsersController.logout').middleware('auth')



Route.get('/usuario/infoObjeto', 'UsersController.infoUserObjeto').middleware('auth')

Route.put('/usuario/update/:id', 'UsersController.updateUser').middleware('auth').where('id', '[0-9]+')
Route.put('/usuario/updateRole/:id', 'UsersController.soloRol').middleware('auth').where('id', '[0-9]+')
Route.put('/usuario/desactivar/:id', 'UsersController.desactivar').middleware('auth').where('id', '[0-9]+')
Route.get('/usuario/validarToken', 'UsersController.validarToken').middleware('auth')

Route.get('/verify/:id', 'UsersController.verify').as('verify')
Route.post('/codigo/:id', 'UsersController.codigo').as('codigo')

//Mapas
Route.post('/mapas/insertar', 'MapasController.registrarMapa')
Route.get('/mapas', 'MapasController.obtenerMapas')
Route.get('/mapas/:id', 'MapasController.obtenerMapa')
Route.put('/mapas/modificar/:id', 'MapasController.actualizarMapa')
Route.delete('/mapas/eliminar/:id', 'MapasController.eliminarMapa')
Route.get('/mapas/stream', 'MapasController.streamMapas')



Route.get('/stream', 'IngredientesController.streamIngredientes')

Route.group(() => {
  //Usuarios
  Route.get('/usuario/info/:id', 'UsersController.infoIDUser').middleware('auth').where('id', '[0-9]+')
  Route.get('/usuario', 'UsersController.infoUsuario')
  Route.get('/usuario/info', 'UsersController.infoUser')
  //Chef
  Route.post('/chef', 'ChefsController.registrarChef').middleware('checkRole:1,2')
  Route.get('/chef/info', 'ChefsController.obtenerChefs').middleware('checkRole:1,2,3')
  Route.get('/chef/info/:id', 'ChefsController.obtenerChef').middleware('checkRole:1,2')
  Route.put('/chef/update/:id', 'ChefsController.actualizarChef').middleware('checkRole:1,2')
  Route.delete('/chef/delete/:id', 'ChefsController.eliminarChef').middleware('checkRole:1')
  //Recetas
  Route.post('/receta', 'RecetasController.registrarReceta').middleware('checkRole:1,2')
  Route.get('/receta/info', 'RecetasController.obtenerRecetas').middleware('checkRole:1,2,3')
  Route.get('/receta/info/:id', 'RecetasController.obtenerReceta').middleware('checkRole:1,2')
  Route.put('/receta/update/:id', 'RecetasController.actualizarReceta').middleware('checkRole:1,2')
  Route.delete('/receta/delete/:id', 'RecetasController.eliminarReceta').middleware('checkRole:1')
  Route.get('/receta/chefs', 'RecetasController.getChefs').middleware('checkRole:1,2')
  //ingredientes

  //Objetos
  Route.post('/objetos/insertar', 'ObjetosController.registrarObjeto').middleware('checkRole:1,2')
  Route.get('/objetos', 'ObjetosController.obtenerObjetos').middleware('checkRole:1,2,3')
  Route.get('/objetos/:id', 'ObjetosController.obtenerObjeto').middleware('checkRole:1,2')
  Route.put('/objetos/modificar/:id', 'ObjetosController.actualizarObjeto').middleware('checkRole:1,2')
  Route.delete('/objetos/eliminar/:id', 'ObjetosController.eliminarObjeto').middleware('checkRole:1')



}).middleware(['activo', 'auth'])

Route.post('/ingrediente', 'IngredientesController.registrarIngrediente')
Route.get('/ingrediente/info', 'IngredientesController.obtenerIngredientes')
Route.get('/ingrediente/info/:id', 'IngredientesController.obtenerIngrediente').where('id', '[0-9]+')
Route.put('/ingrediente/update/:id', 'IngredientesController.actualizarIngrediente').where('id', '[0-9]+')
Route.delete('/ingrediente/delete/:id', 'IngredientesController.eliminarIngrediente').where('id', '[0-9]+')
