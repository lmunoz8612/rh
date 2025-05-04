const catalogsConfig = [
    {
        name: 'vacantes',
        label: 'Vacantes',
        children: [
            { name: 'area', label: 'Área', icon: 'ri-user-community-line', path: 'vacantes/area', },
            { name: 'departamento', label: 'Departamento', icon: 'ri-team-line', path: 'vacantes/departamento' },
            { name: 'oficina', label: 'Oficina', icon: 'ri-map-pin-line', path: 'vacantes/oficina' },
            { name: 'tipo-vacante', label: 'Tipo de Vacante', icon: 'ri-user-2-line', path: 'vacantes/tipo-vacante' },
        ],
    },
    {
        name: 'usuarios',
        label: 'Usuarios',
        children: [
            { name: 'genero', label: 'Género', icon: 'ri-genderless-line', path: 'usuarios/genero' },
            { name: 'nacionalidad', label: 'Nacionalidad', icon: 'ri-flag-line', path: 'usuarios/nacionalidad' },
            { name: 'estado-civil', label: 'Estado Civil', icon: 'ri-user-heart-line', path: 'usuarios/estado-civil' },
            { name: 'parentesco', label: 'Parentesco', icon: 'ri-shake-hands-line', path: 'usuarios/parentesco' },
            { name: 'roles', label: 'Roles', icon: 'ri-settings-5-line', path: 'usuarios/roles' },
        ],
    },
    {
        name: 'estatus',
        label: 'Estatus',
        children: [
            { name: 'vacantes', label: 'Estatus de Vacantes', icon: 'ri-info-card-line', path: 'estatus/vacantes' },
            { name: 'usuarios', label: 'Estatus de Usuarios', icon: 'ri-user-line', path: 'estatus/usuarios' },
        ],
    },
];

export default catalogsConfig;