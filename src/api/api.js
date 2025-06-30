const baseURL = '/rh-api';
const headers = {
    'Content-Type': 'application/json',
};

let unauthorized = false;
const invoke = (path, method, body = {}, multipart) => {
    try {
        const requestOptions = {
            method: method,
            headers,
            credentials: 'include',
        };
        if (method !== 'GET') {
            if (multipart) {
                requestOptions['headers'] = {};
                requestOptions['body'] = body;
            }
            else {
                requestOptions['body'] = JSON.stringify(body);
            }
        }

        const promise = new Promise((resolve, reject) => (
            fetch(`${baseURL}/${path}`, requestOptions)
                .then(response => {
                    if (!path.includes('login') !== false && response.status === 401) {
                        if (!unauthorized) {
                            unauthorized = true;
                            localStorage.clear();
                            window.location.href = '/login';
                            window.alert('\nTu sesión ha caducado.\nVuelva a iniciar sesión para seguir utilizando la plataforma.');
                        }
                        reject('No autorizado (401)');
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => reject(error))
        ));

        return promise;
    }
    catch (error) {
        throw new Error(error || 'Error en la petición');
    }
};

const api = {
    get: (path) => invoke(path, 'GET'),
    post: (path, body, multipart = false) => invoke(path, 'POST', body, multipart),
    put: (path, body, multipart = false) => invoke(path, 'PUT', body, multipart),
    delete: (path) => invoke(path, 'DELETE'),
    patch: (path, body) => invoke(path, 'PATCH', body),
};

export default api;