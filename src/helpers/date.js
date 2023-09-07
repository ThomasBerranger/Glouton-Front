function format(date) {
    const dayMonthYear = date.split('/');

    return `${dayMonthYear[2]}-${dayMonthYear[1]}-${dayMonthYear[0]}`;
}

function unFormat(date) {
    const dayMonthYear = date.split('-');

    return `${dayMonthYear[2]}/${dayMonthYear[1]}/${dayMonthYear[0]}`;
}

export {format, unFormat};