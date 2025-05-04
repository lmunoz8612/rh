export const CATALOG_FIELDS = {
    job_position: {
        positions: {
            id: 'pk_job_position_id',
            description: 'inmediate_supervisor_full_name',
        },
        area: {
            id: 'pk_job_position_area_id',
            description: 'job_position_area',
            status: 'status',
        },
        department: {
            id: 'pk_job_position_department_id',
            description: 'job_position_department',
            parent_id: 'fk_job_position_area_id',
            status: 'status',
        },
        office: {
            id: 'pk_job_position_office_id',
            description: 'job_position_office',
            status: 'status',
        },
        type: {
            id: 'pk_job_position_type_id',
            description: 'job_position_type',
            status: 'status',
        },
        status: {
            id: 'pk_job_position_status_id',
            description: 'job_position_status',
            status: 'status',
        },
        admin_status: {
            id: 'pk_job_position_admin_status_id',
            description: 'job_position_admin_status',
            status: 'status',
        },
    },
    user: {
        genders: {
            id: 'pk_gender_id',
            description: 'gender',
            status: 'status',
        },
        nationalities: {
            id: 'pk_nationality_id',
            description: 'nationality',
            status: 'status',
        },
        marital_status: {
            id: 'pk_marital_status_id',
            description: 'marital_status',
            status: 'status',
        },
        relationships: {
            id: 'pk_relationship_id',
            description: 'relationship',
            status: 'status',
        },
        roles: {
            id: 'pk_role_id',
            description: 'role',
            status: 'status',
        },
        status: {
            id: 'pk_user_status_id',
            description: 'user_status',
            status: 'status',
        },
    },
    default: {
        states: {
            id: 'pk_state_id',
            description: 'state_name',
            parent_id: 'fk_country_id',
            status: 'status',
        },
        countries: {
            id: 'pk_country_id',
            description: 'country_name',
            status: 'status',
        },
    },
};