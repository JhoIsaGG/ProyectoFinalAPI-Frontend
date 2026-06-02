CREATE DATABASE IF NOT EXISTS proyectofinalapi;
USE proyectofinalapi;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL, 
    descripcion VARCHAR(255) NULL,
    estado BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL, 
    updated_by INT NULL
);

CREATE TABLE departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL, 
    descripcion VARCHAR(255) NULL,
    estado BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL, 
    updated_by INT NULL
);

INSERT INTO roles (nombre, descripcion, estado, created_by, updated_by) VALUES
('Superadmistrador', 'Administrador del sistema', 1, 1, 1),
('Agente', 'Agente de soporte', 1, 1, 1),
('Empleado', 'Empleado regular', 1, 1, 1);

INSERT INTO departamentos (nombre, descripcion, estado, created_by, updated_by) VALUES
('Dirección General', 'Departamento de dirección general', 1, 1, 1),
('RRHH', 'Recursos Humanos', 1, 1, 1);


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(100) NOT NULL, 
    apellido VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,  
    password VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    departamento_id INT NOT NULL, 
    estado BOOLEAN NOT NULL DEFAULT 1, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NULL, 
    updated_by INT NULL,
    
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id),
    CONSTRAINT fk_usuarios_departamento FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

INSERT INTO usuarios (nombre, apellido, email, telefono, password, rol_id, departamento_id, estado, created_by, updated_by) VALUES
('Admin', 'Admin', 'admin@empresa.com', '502-12345678', '1234', 1, 1, 1, 1, 1);

-- 3. AGREGAR LLAVES FORÁNEAS DE AUDITORÍA A LAS PRIMERAS TABLAS
-- (Ahora que 'usuarios' ya existe, podemos vincularlas de forma segura)
ALTER TABLE roles ADD CONSTRAINT fk_roles_created FOREIGN KEY (created_by) REFERENCES usuarios(id);
ALTER TABLE roles ADD CONSTRAINT fk_roles_updated FOREIGN KEY (updated_by) REFERENCES usuarios(id);

ALTER TABLE departamentos ADD CONSTRAINT fk_dept_created FOREIGN KEY (created_by) REFERENCES usuarios(id);
ALTER TABLE departamentos ADD CONSTRAINT fk_dept_updated FOREIGN KEY (updated_by) REFERENCES usuarios(id);

ALTER TABLE usuarios ADD CONSTRAINT fk_user_created FOREIGN KEY (created_by) REFERENCES usuarios(id);
ALTER TABLE usuarios ADD CONSTRAINT fk_user_updated FOREIGN KEY (updated_by) REFERENCES usuarios(id);


-- 4. TABLAS COMPLEMENTARIAS DEL TICKET
CREATE TABLE categorias_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50) NOT NULL, 
    estado BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL, 
    updated_by INT NULL,
    CONSTRAINT fk_cat_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_cat_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);

CREATE TABLE estados_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50) NOT NULL, 
    estado BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL, 
    updated_by INT NULL,
    CONSTRAINT fk_est_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_est_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);

CREATE TABLE prioridades_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    orden INT NOT NULL,
    nombre VARCHAR(50) NOT NULL, 
    estado BOOLEAN NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL, 
    updated_by INT NULL,
    CONSTRAINT fk_prio_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_prio_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);


-- 5. ENTIDADES DE AGENTES
CREATE TABLE agentes (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    usuario_id INT NOT NULL, -- Falta de coma corregida abajo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL, 
    updated_by INT NULL,
    CONSTRAINT fk_agentes_user FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_agentes_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_agentes_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id)
);

CREATE TABLE agente_categorias (
    agente_id INT NOT NULL, 
    categoria_ticket_id INT NOT NULL, -- Falta de coma corregida abajo
    PRIMARY KEY (agente_id, categoria_ticket_id), -- Se añade llave primaria compuesta
    CONSTRAINT fk_ag_cat_agente FOREIGN KEY (agente_id) REFERENCES agentes(id),
    CONSTRAINT fk_ag_cat_categoria FOREIGN KEY (categoria_ticket_id) REFERENCES categorias_ticket(id)
);


-- 6. TABLA PRINCIPAL DE TICKETS
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    titulo VARCHAR(100) NOT NULL, 
    descripcion TEXT NOT NULL, -- Cambiado de VARCHAR(200) a TEXT
    estado_ticket_id INT NOT NULL, 
    prioridad_ticket_id INT NOT NULL, 
    categoria_ticket_id INT NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT 1, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL, 
    updated_by INT NULL,
    
    CONSTRAINT fk_tk_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_tk_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_tk_estado FOREIGN KEY (estado_ticket_id) REFERENCES estados_ticket(id),
    CONSTRAINT fk_tk_prioridad FOREIGN KEY (prioridad_ticket_id) REFERENCES prioridades_ticket(id),
    CONSTRAINT fk_tk_categoria FOREIGN KEY (categoria_ticket_id) REFERENCES categorias_ticket(id)
);


-- 7. TRANSACCIONES Y SEGUIMIENTO
CREATE TABLE comentarios_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Corregido AUTO_INCREMENT y NOT NULL implícito
    ticket_id INT NOT NULL,
    usuario_id INT NOT NULL, 
    descripcion TEXT NOT NULL, -- Corregido acento en el nombre de columna y cambiado a TEXT
    estado BOOLEAN NOT NULL DEFAULT 1, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL, 
    updated_by INT NULL,
    
    CONSTRAINT fk_com_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    CONSTRAINT fk_com_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_com_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_com_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id)
); 

CREATE TABLE asignaciones_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Corregido AUTO_INCREMENT
    ticket_id INT NOT NULL, 
    agente_id INT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL, 
    updated_by INT NULL,
    
    CONSTRAINT fk_asig_created_by FOREIGN KEY (created_by) REFERENCES usuarios(id), 
    CONSTRAINT fk_asig_updated_by FOREIGN KEY (updated_by) REFERENCES usuarios(id),
    CONSTRAINT fk_asig_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    CONSTRAINT fk_asig_agente FOREIGN KEY (agente_id) REFERENCES agentes(id)
);


