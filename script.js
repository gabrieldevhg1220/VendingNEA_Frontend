const apiUrl = 'http://localhost:5048/api';

// Cargar SweetAlert2 desde CDN
const swLink = document.createElement('script');
swLink.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
swLink.onload = () => console.log('SweetAlert2 cargado');
document.head.appendChild(swLink);

// ==================== MÁQUINAS ====================
async function loadMaquinas() {
    const response = await fetch(`${apiUrl}/Maquinas`);
    const maquinas = await response.json();
    const list = document.getElementById('maquinasList');
    list.innerHTML = '';
    maquinas.forEach(m => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="card-title mb-0">${m.nroSerie}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Descripción:</strong> ${m.descripcion}</p>
                        <p class="card-text"><strong>Estado:</strong> <span class="badge bg-${m.estado.toLowerCase() === 'operativa' ? 'success' : 'danger'}">${m.estado}</span></p>
                        <p class="card-text"><strong>Marca:</strong> ${m.marca}</p>
                        <p class="card-text"><strong>Modelo:</strong> ${m.modelo}</p>
                        <p class="card-text"><strong>Tipo Cobro:</strong> ${m.tipoCobro}</p>
                        <p class="card-text"><strong>ID Acuerdo:</strong> ${m.idAcuerdo}</p>
                        <p class="card-text"><strong>ID Máquina:</strong> ${m.idMaquina}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="editMaquina(${JSON.stringify(m)})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteMaquina(${m.idMaquina})">Eliminar</button>
                    </div>
                </div>
            </div>`;
        list.innerHTML += card;
    });
}

// ==================== EMPLEADOS ====================
async function loadEmpleados() {
    const response = await fetch(`${apiUrl}/Empleados`);
    const empleados = await response.json();
    const list = document.getElementById('empleadosList');
    list.innerHTML = '';
    empleados.forEach(e => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-info text-white">
                        <h5 class="card-title mb-0">${e.nombre} ${e.apellido}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Legajo:</strong> ${e.legajo}</p>
                        <p class="card-text"><strong>DNI:</strong> ${e.dni}</p>
                        <p class="card-text"><strong>Teléfono:</strong> ${e.telefono || 'Sin dato'}</p>
                        <p class="card-text"><strong>Email:</strong> ${e.email || 'Sin dato'}</p>
                        <p class="card-text"><strong>Fecha Ingreso:</strong> ${new Date(e.fechaIngreso).toLocaleDateString('es-AR')}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="editEmpleado(${JSON.stringify(e)})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmpleado(${e.legajo})">Eliminar</button>
                    </div>
                </div>
            </div>`;
        list.innerHTML += card;
    });
}

// ==================== ACUERDOS (TODOS) ====================
async function loadAcuerdos() {
    const response = await fetch(`${apiUrl}/Acuerdos`);
    const acuerdos = await response.json();
    const list = document.getElementById('acuerdosList');
    list.innerHTML = '';
    acuerdos.forEach(a => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h5 class="card-title mb-0">Acuerdo #${a.idAcuerdo}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Establecimiento ID:</strong> ${a.idEstablecimiento}</p>
                        <p class="card-text"><strong>Inicio:</strong> ${new Date(a.fechaInicio).toLocaleDateString('es-AR')}</p>
                        <p class="card-text"><strong>Fin:</strong> ${new Date(a.fechaFin).toLocaleDateString('es-AR')}</p>
                        <p class="card-text"><strong>Tipo Condición:</strong> ${a.tipoCondicion}</p>
                        <p class="card-text"><strong>Valor:</strong> $${parseFloat(a.valorCondicion).toFixed(2)}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="editAcuerdo(${JSON.stringify(a)})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAcuerdo(${a.idAcuerdo})">Eliminar</button>
                    </div>
                </div>
            </div>`;
        list.innerHTML += card;
    });
}

// ==================== PRÓXIMOS A FINALIZAR (REEMPLAZA LA LISTA PRINCIPAL) ====================
async function loadProximosAcuerdos() {
    const response = await fetch(`${apiUrl}/Acuerdos/proximosAFinalizar`);
    const proximos = await response.json();
    const list = document.getElementById('acuerdosList');
    list.innerHTML = '';

    if (proximos.length === 0) {
        list.innerHTML = '<div class="col-12"><p class="text-center text-muted fs-4">No hay acuerdos próximos a finalizar en los próximos 30 días.</p></div>';
        return;
    }

    proximos.forEach(a => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-warning">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="card-title mb-0">Acuerdo #${a.idAcuerdo} (Próximo a vencer)</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Establecimiento ID:</strong> ${a.idEstablecimiento}</p>
                        <p class="card-text"><strong>Inicio:</strong> ${new Date(a.fechaInicio).toLocaleDateString('es-AR')}</p>
                        <p class="card-text"><strong>Fin:</strong> <strong class="text-danger">${new Date(a.fechaFin).toLocaleDateString('es-AR')}</strong></p>
                        <p class="card-text"><strong>Tipo Condición:</strong> ${a.tipoCondicion}</p>
                        <p class="card-text"><strong>Valor:</strong> $${parseFloat(a.valorCondicion).toFixed(2)}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="editAcuerdo(${JSON.stringify(a)})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAcuerdo(${a.idAcuerdo})">Eliminar</button>
                    </div>
                </div>
            </div>`;
        list.innerHTML += card;
    });
}

// ==================== ELIMINAR CON SWEETALERT2 ====================
async function deleteMaquina(id) {
    const result = await Swal.fire({
        title: '¿Eliminar máquina?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`${apiUrl}/Maquinas/${id}`, { method: 'DELETE' });
        if (response.ok) {
            Swal.fire('¡Eliminada!', 'La máquina ha sido eliminada.', 'success');
            loadMaquinas();
        } else {
            const error = await response.json();
            Swal.fire('Error', error.message || 'No se pudo eliminar la máquina', 'error');
        }
    } catch (err) {
        Swal.fire('Error', 'No se pudo conectar al servidor', 'error');
    }
}

async function deleteEmpleado(id) {
    const result = await Swal.fire({
        title: '¿Eliminar empleado?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`${apiUrl}/Empleados/${id}`, { method: 'DELETE' });
        if (response.ok) {
            Swal.fire('¡Eliminado!', 'El empleado ha sido eliminado.', 'success');
            loadEmpleados();
        } else {
            const error = await response.json();
            Swal.fire('Error', error.message || 'No se pudo eliminar el empleado', 'error');
        }
    } catch (err) {
        Swal.fire('Error', 'No se pudo conectar al servidor', 'error');
    }
}

async function deleteAcuerdo(id) {
    const result = await Swal.fire({
        title: '¿Eliminar acuerdo?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
        const response = await fetch(`${apiUrl}/Acuerdos/${id}`, { method: 'DELETE' });
        if (response.ok) {
            Swal.fire('¡Eliminado!', 'El acuerdo ha sido eliminado.', 'success');
            loadAcuerdos();
        } else {
            const error = await response.json();
            Swal.fire('Error', error.message || 'No se pudo eliminar el acuerdo', 'error');
        }
    } catch (err) {
        Swal.fire('Error', 'No se pudo conectar al servidor', 'error');
    }
}

// ==================== EL RESTO QUEDA IGUAL ====================
function editMaquina(maquina) {
    document.getElementById('idMaquina').value = maquina.idMaquina;
    document.getElementById('nroSerie').value = maquina.nroSerie;
    document.getElementById('descripcion').value = maquina.descripcion;
    document.getElementById('estado').value = maquina.estado;
    document.getElementById('marca').value = maquina.marca;
    document.getElementById('modelo').value = maquina.modelo;
    document.getElementById('tipoCobro').value = maquina.tipoCobro;
    document.getElementById('idAcuerdo').value = maquina.idAcuerdo;
    new bootstrap.Modal(document.getElementById('maquinaModal')).show();
}
async function saveMaquina() {
    const id = document.getElementById('idMaquina').value;
    const maquina = {
        idMaquina: id ? parseInt(id) : 0,
        nroSerie: document.getElementById('nroSerie').value,
        descripcion: document.getElementById('descripcion').value,
        estado: document.getElementById('estado').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo').value,
        tipoCobro: document.getElementById('tipoCobro').value,
        idAcuerdo: parseInt(document.getElementById('idAcuerdo').value)
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/Maquinas/${id}` : `${apiUrl}/Maquinas`;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maquina)
    });
    bootstrap.Modal.getInstance(document.getElementById('maquinaModal')).hide();
    loadMaquinas();
}
function editEmpleado(empleado) {
    document.getElementById('legajoEmpleado').value = empleado.legajo;
    document.getElementById('nombreEmpleado').value = empleado.nombre;
    document.getElementById('apellidoEmpleado').value = empleado.apellido;
    document.getElementById('dniEmpleado').value = empleado.dni;
    document.getElementById('telefonoEmpleado').value = empleado.telefono || '';
    document.getElementById('emailEmpleado').value = empleado.email || '';
    document.getElementById('fechaIngresoEmpleado').value = empleado.fechaIngreso.split('T')[0];
    new bootstrap.Modal(document.getElementById('empleadoModal')).show();
}
async function saveEmpleado() {
    const id = document.getElementById('legajoEmpleado').value;
    const empleado = {
        legajo: id ? parseInt(id) : 0,
        nombre: document.getElementById('nombreEmpleado').value,
        apellido: document.getElementById('apellidoEmpleado').value,
        dni: document.getElementById('dniEmpleado').value,
        telefono: document.getElementById('telefonoEmpleado').value,
        email: document.getElementById('emailEmpleado').value,
        fechaIngreso: document.getElementById('fechaIngresoEmpleado').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/Empleados/${id}` : `${apiUrl}/Empleados`;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleado)
    });
    bootstrap.Modal.getInstance(document.getElementById('empleadoModal')).hide();
    loadEmpleados();
}
function editRepositor(repositor) {
    document.getElementById('legajoRepositor').value = repositor.legajo;
    document.getElementById('categoriaLicencia').value = repositor.categoriaLicencia;
    document.getElementById('turno').value = repositor.turno;
    document.getElementById('zonaAsignada').value = repositor.zonaAsignada;
    new bootstrap.Modal(document.getElementById('repositorModal')).show();
}
async function saveRepositor() {
    const id = document.getElementById('legajoRepositor').value;
    const repositor = {
        legajo: parseInt(id) || 0,
        categoriaLicencia: document.getElementById('categoriaLicencia').value,
        turno: document.getElementById('turno').value,
        zonaAsignada: document.getElementById('zonaAsignada').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/Repositores/${id}` : `${apiUrl}/Repositores`;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repositor)
    });
    bootstrap.Modal.getInstance(document.getElementById('repositorModal')).hide();
    loadRepositores();
}
async function deleteRepositor(id) {
    if (confirm('¿Eliminar?')) {
        await fetch(`${apiUrl}/Repositores/${id}`, { method: 'DELETE' });
        loadRepositores();
    }
}
function editTecnico(tecnico) {
    document.getElementById('legajoTecnico').value = tecnico.legajo;
    document.getElementById('especialidad').value = tecnico.especialidad;
    document.getElementById('nivelCertificacion').value = tecnico.nivelCertificacion;
    new bootstrap.Modal(document.getElementById('tecnicoModal')).show();
}
async function saveTecnico() {
    const id = document.getElementById('legajoTecnico').value;
    const tecnico = {
        legajo: parseInt(id) || 0,
        especialidad: document.getElementById('especialidad').value,
        nivelCertificacion: document.getElementById('nivelCertificacion').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/Tecnicos/${id}` : `${apiUrl}/Tecnicos`;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tecnico)
    });
    bootstrap.Modal.getInstance(document.getElementById('tecnicoModal')).hide();
    loadTecnicos();
}
async function deleteTecnico(id) {
    if (confirm('¿Eliminar?')) {
        await fetch(`${apiUrl}/Tecnicos/${id}`, { method: 'DELETE' });
        loadTecnicos();
    }
}
function editAcuerdo(acuerdo) {
    document.getElementById('idAcuerdo').value = acuerdo.idAcuerdo;
    document.getElementById('fechaInicio').value = acuerdo.fechaInicio.split('T')[0];
    document.getElementById('fechaFin').value = acuerdo.fechaFin.split('T')[0];
    document.getElementById('tipoCondicion').value = acuerdo.tipoCondicion;
    document.getElementById('valorCondicion').value = acuerdo.valorCondicion;
    document.getElementById('idEstablecimientoAcuerdo').value = acuerdo.idEstablecimiento;
    new bootstrap.Modal(document.getElementById('acuerdoModal')).show();
}
async function saveAcuerdo() {
    const id = document.getElementById('idAcuerdo').value;
    const acuerdo = {
        idAcuerdo: id ? parseInt(id) : 0,
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaFin: document.getElementById('fechaFin').value,
        tipoCondicion: document.getElementById('tipoCondicion').value,
        valorCondicion: parseFloat(document.getElementById('valorCondicion').value),
        idEstablecimiento: parseInt(document.getElementById('idEstablecimientoAcuerdo').value)
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/Acuerdos/${id}` : `${apiUrl}/Acuerdos`;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acuerdo)
    });
    bootstrap.Modal.getInstance(document.getElementById('acuerdoModal')).hide();
    loadAcuerdos();
}
// ==================== REPOSITORES ====================
async function loadRepositores() {
    const response = await fetch(`${apiUrl}/Repositores`);
    const repositores = await response.json();
    const list = document.getElementById('repositoresList');
    list.innerHTML = '';
    repositores.forEach(r => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-warning text-dark">
                        <h5 class="card-title mb-0">${r.nombre} ${r.apellido}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Legajo:</strong> ${r.legajo}</p>
                        <p class="card-text"><strong>Categoría Licencia:</strong> ${r.categoriaLicencia}</p>
                        <p class="card-text"><strong>Turno:</strong> ${r.turno}</p>
                        <p class="card-text"><strong>Zona:</strong> ${r.zonaAsignada}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="editRepositor(${JSON.stringify(r)})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteRepositor(${r.legajo})">Eliminar</button>
                    </div>
                </div>
            </div>`;
        list.innerHTML += card;
    });
    if (repositores.length === 0) {
        list.innerHTML = '<div class="col-12"><p class="text-muted text-center">No hay repositores registrados.</p></div>';
    }
}
// ==================== TÉCNICOS ====================
async function loadTecnicos() {
    const response = await fetch(`${apiUrl}/Tecnicos`);
    const tecnicos = await response.json();
    const list = document.getElementById('tecnicosList');
    list.innerHTML = '';
    tecnicos.forEach(t => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-danger text-white">
                        <h5 class="card-title mb-0">${t.nombre} ${t.apellido}</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text"><strong>Legajo:</strong> ${t.legajo}</p>
                        <p class="card-text"><strong>Especialidad:</strong> ${t.especialidad}</p>
                        <p class="card-text"><strong>Nivel Certificación:</strong> ${t.nivelCertificacion}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="editTecnico(${JSON.stringify(t)})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteTecnico(${t.legajo})">Eliminar</button>
                    </div>
                </div>
            </div>`;
        list.innerHTML += card;
    });
    if (tecnicos.length === 0) {
        list.innerHTML = '<div class="col-12"><p class="text-muted text-center">No hay técnicos registrados.</p></div>';
    }
}