export const $ = (id) => document.getElementById(id);
export const formatDate = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj)) return null;
    return dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
export const getDateString = () => new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
export const padWithZeros = (number, length) => number.toString().padStart(length, '0');
export const capitalizeString = (str = '') => str ? str[0].toUpperCase() + str.slice(1) : '';
export const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0 && obj.constructor === Object;
