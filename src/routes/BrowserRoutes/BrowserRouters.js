import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// @pages
import Home from '../../pages/Home/Home';
import UserList from '../../pages/Users/UserList';
import UserForm from '../../pages/Users/UserForm/UserForm';
import Vacations from '../../pages/Vacations/Vacations';
import NoPage from '../../pages/NoPage/NoPage';
import JobPositionsList from '../../pages/JobPositions/JobPositionsList';
import JobPositionForm from '../../pages/JobPositions/JobPositionForm/JobPositionForm';
import ELearning from '../../pages/ELearning/ELearning';
import Evaluations from '../../pages/Evaluations/Evaluations';
import PoliciesList from '../../pages/Policies/PoliciesList';
import PoliciesForm from '../../pages/Policies/PoliciesForm/PoliciesForm';
import UsersPerPolicy from '../../pages/Policies/UsersPerPolicy';
import Communication from '../../pages/Communication/Communication';
import CommunityManagerPosts from '../../pages/Communication/CommunityManager/Posts';
import CommunityManagerPostForm from '../../pages/Communication/CommunityManager/PostForm';
import AnonymousMailbox from '../../pages/AnonymousMailbox/AnonymousMailbox';
import Benefits from '../../pages/Benefits/Benefits';
import Survey from '../../pages/Survey/Survey';
import Documentation from '../../pages/Documentation/Documentation';
import PasswordRecovery from '../../pages/PasswordRecovery/PasswordRecovery';
import PasswordUpdate from '../../pages/PasswordUpdate/PasswordUpdate';
import Directory from '../../pages/Directory/Directory';
import CatalogList from '../../pages/Catalogs/CatalogsList';
import JobPositionAreaCatalog from '../../pages/Catalogs/JobPositions/Area/AreaCatalog';
import JobPositionAreaForm from '../../pages/Catalogs/JobPositions/Area/AreaForm';
import JobPositionDepartmentCatalog from '../../pages/Catalogs/JobPositions/Department/DepartmentCatalog';
import JobPositionDepartmentForm from '../../pages/Catalogs/JobPositions/Department/DepartmentForm';
import JobPositionOfficeCatalog from '../../pages/Catalogs/JobPositions/Office/OfficeCatalog';
import JobPositionOfficeForm from '../../pages/Catalogs/JobPositions/Office/OfficeForm';
import JobPositionTypeCatalog from '../../pages/Catalogs/JobPositions/Type/TypeCatalog';
import JobPositionTypeForm from '../../pages/Catalogs/JobPositions/Type/TypeForm';
import JobPositionStatusCatalog from '../../pages/Catalogs/Status/JobPositions/StatusCatalog';
import UserStatusCatalog from '../../pages/Catalogs/Status/Users/StatusCatalog';
import UserGendersCatalog from '../../pages/Catalogs/Users/Genders/GendersCatalog';
import UserGendersForm from '../../pages/Catalogs/Users/Genders/GendersForm';
import UserMaritalStatusCatalog from '../../pages/Catalogs/Users/MaritalStatus/MaritalStatusCatalog';
import UserMaritalStatusForm from '../../pages/Catalogs/Users/MaritalStatus/MaritalStatusForm';
import UserNationalitiesCatalog from '../../pages/Catalogs/Users/Nationalities/NationalitiesCatalog';
import UserNationalitiesForm from '../../pages/Catalogs/Users/Nationalities/NationalitiesForm';
import UserRelationshipsCatalog from '../../pages/Catalogs/Users/RelationShips/RelationshipsCatalog';
import UserRelationshipsForm from '../../pages/Catalogs/Users/RelationShips/RelationShipsForm';
import UserRolesCatalog from '../../pages/Catalogs/Users/Roles/RolesCatalog';
import UserRolesForm from '../../pages/Catalogs/Users/Roles/RolesForm';

// @components
import Login from '../../components/Login/Login';
import Profile from '../../pages/Profile/Profile';
import Logout from '../../components/Logout/Logout';
import PrivateRoute from '../../routes/PrivateRoute/PrivateRoute';
import Organization from '../../components/Charts/Organization';
import { ROLES, } from '../../assets/constants/constants';

// Configuración de rutas públicas, privadas y catálogos
const publicRoutes = [
    { path: '/', element: <Navigate to="/login" /> },
    { path: '/login', element: <Login /> },
    { path: '/recuperar-contraseña', element: <PasswordRecovery /> },
    { path: '/restablecer-contraseña', element: <PasswordUpdate /> },
];

const privateRoutes = [
    /* Menú */
    { path: '/home', element: <Home />, roles: ROLES.ALL },
    { path: '/perfil', element: <Profile />, roles: ROLES.ALL },
    { path: '/organigrama', element: <Organization />, roles: ROLES.ALL },
    { path: '/directorio', element: <Directory />, roles: ROLES.ALL },
    { path: '/vacaciones', element: <Vacations />, roles: ROLES.ALL },
    { path: '/aprendizaje', element: <ELearning />, roles: ROLES.ALL },
    { path: '/comunicacion-interna', element: <Communication />, roles: ROLES.ALL },
    { path: '/creacion-contenido', element: <CommunityManagerPosts />, roles: [ROLES.SUPER_ADMIN, ROLES.COMMUNITY_MANAGER] },
    { path: '/evaluacion-desempeño', element: <Evaluations />, roles: ROLES.ALL },
    { path: '/buzon-anonimo', element: <AnonymousMailbox />, roles: ROLES.ALL },
    { path: '/beneficios', element: <Benefits />, roles: ROLES.ALL },
    { path: '/encuesta-laboral', element: <Survey />, roles: ROLES.ALL },
    { path: '/documentacion', element: <Documentation />, roles: ROLES.ALL },
    { path: '/catalogos', element: <CatalogList />, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
    { path: '/logout', element: <Logout /> },

    /* Administración de usuarios */
    { path: '/usuarios', element: <UserList />, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMMUNITY_MANAGER] },
    { path: '/usuarios/crear', element: <UserForm />, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMMUNITY_MANAGER] },
    { path: '/usuarios/editar/:id', element: <UserForm />, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMMUNITY_MANAGER] },

    /* Vacantes */
    { path: '/vacantes', element: <JobPositionsList />, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMMUNITY_MANAGER] },
    { path: '/vacantes/crear', element: <JobPositionForm />, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMMUNITY_MANAGER] },
    { path: '/vacantes/editar/:id', element: <JobPositionForm />, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COMMUNITY_MANAGER] },

    /* Políticas */
    { path: '/politicas-empresa', element: <PoliciesList />, },
    { path: '/politicas-empresa/crear', element: <PoliciesForm /> },
    { path: '/politicas-empresa/editar/:id', element: <PoliciesForm /> },
    { path: '/politicas-empresa/:id/ver-usuarios', element: <UsersPerPolicy /> },

    /* Creación de contenido */
    { path: '/creacion-contenido/crear', element: <CommunityManagerPostForm /> },
    { path: '/creacion-contenido/editar/:id', element: <CommunityManagerPostForm /> },

    /* Catálogos */
    { path: '/catalogos/vacantes/area', element: <JobPositionAreaCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/area/crear', element: <JobPositionAreaForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/area/editar/:id', element: <JobPositionAreaForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/departamento', element: <JobPositionDepartmentCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/departamento/crear', element: <JobPositionDepartmentForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/departamento/editar/:id', element: <JobPositionDepartmentForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/oficina', element: <JobPositionOfficeCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/oficina/crear', element: <JobPositionOfficeForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/oficina/editar/:id', element: <JobPositionOfficeForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/tipo-vacante', element: <JobPositionTypeCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/tipo-vacante/crear', element: <JobPositionTypeForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/vacantes/tipo-vacante/editar/:id', element: <JobPositionTypeForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/estatus/vacantes', element: <JobPositionStatusCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/estatus/usuarios', element: <UserStatusCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/genero', element: <UserGendersCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/genero/crear', element: <UserGendersForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/genero/editar/:id', element: <UserGendersForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/estado-civil', element: <UserMaritalStatusCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/estado-civil/crear', element: <UserMaritalStatusForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/estado-civil/editar/:id', element: <UserMaritalStatusForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/nacionalidad', element: <UserNationalitiesCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/nacionalidad/crear', element: <UserNationalitiesForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/nacionalidad/editar/:id', element: <UserNationalitiesForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/parentesco', element: <UserRelationshipsCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/parentesco/crear', element: <UserRelationshipsForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/parentesco/editar/:id', element: <UserRelationshipsForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/roles', element: <UserRolesCatalog />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/roles/crear', element: <UserRolesForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
    { path: '/catalogos/usuarios/roles/editar/:id', element: <UserRolesForm />, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
];

const notFoundRoute = [{ path: '*', element: <NoPage /> }];

const routes = [
    ...publicRoutes,
    ...privateRoutes,
    ...notFoundRoute,
];

const BrowserRouters = () => (
    <Routes>
        {routes.map(({ path, element, roles }, index) => (
            <Route
                key={index}
                path={path}
                element={roles ? <PrivateRoute roles={roles}>{element}</PrivateRoute> : element}
            />
        ))}
    </Routes>
);

export default BrowserRouters;
