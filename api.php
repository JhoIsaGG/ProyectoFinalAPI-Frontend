<?php 

declare(strict_types=1);

// Rutas para Empleados
$router->get('/proyectofinalapi/public/api/empleados', [$empleadoController, 'index'], $protectedMiddlewares);
$router->get('/api/empleados/{id}', [$empleadoController, 'show'], $protectedMiddlewares);
$router->post('/proyectofinalapi/public/api/empleados', [$empleadoController, 'store'], $protectedMiddlewares);
$router->put('/proyectofinalapi/public/api/empleados/{id}', [$empleadoController, 'update'], $protectedMiddlewares);
$router->delete('/proyectofinalapi/public/api/empleados/{id}', [$empleadoController, 'destroy'], $protectedMiddlewares);

// Rutas para Usuarios
$router->get('/proyectofinalapi/public/api/usuarios', [$usuarioController, 'index'], $protectedMiddlewares);
$router->get('/proyectofinalapi/public/api/usuarios/{id}', [$usuarioController, 'show'], $protectedMiddlewares);
$router->post('/proyectofinalapi/public/api/usuarios', [$usuarioController, 'store'], $protectedMiddlewares);
$router->put('/proyectofinalapi/public/api/usuarios/{id}', [$usuarioController, 'update'], $protectedMiddlewares);
$router->delete('/proyectofinalapi/public/api/usuarios/{id}', [$usuarioController, 'destroy'], $protectedMiddlewares);

// Rutas para Roles
$router->get('/proyectofinalapi/public/api/roles', [$rolController, 'index'], $protectedMiddlewares);
$router->get('/proyectofinalapi/public/api/roles/{id}', [$rolController, 'show'], $protectedMiddlewares);
$router->post('/proyectofinalapi/public/api/roles', [$rolController, 'store'], $protectedMiddlewares);
$router->put('/proyectofinalapi/public/api/roles/{id}', [$rolController, 'update'], $protectedMiddlewares);
$router->delete('/proyectofinalapi/public/api/roles/{id}', [$rolController, 'destroy'], $protectedMiddlewares);

// Rutas para Departamentos
$router->get('/proyectofinalapi/public/api/departamentos', [$departamentoController, 'index'], $protectedMiddlewares);
$router->get('/proyectofinalapi/public/api/departamentos/{id}', [$departamentoController, 'show'], $protectedMiddlewares);
$router->post('/proyectofinalapi/public/api/departamentos', [$departamentoController, 'store'], $protectedMiddlewares);
$router->put('/proyectofinalapi/public/api/departamentos/{id}', [$departamentoController, 'update'], $protectedMiddlewares);
$router->delete('/proyectofinalapi/public/api/departamentos/{id}', [$departamentoController, 'destroy'], $protectedMiddlewares);
?>