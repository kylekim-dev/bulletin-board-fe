export const getPositiveOrNegative = (val: number | null) => {
    if(val === null || val === undefined || val === 0){
        return '';
    }
    return val > 0 ? 'success.main' : 'error.main';
}