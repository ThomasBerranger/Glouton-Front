function formatToValidDate(date) {
    const [day, month, year] = date.split('/');

    return `${year}-${month}-${day}`;
}

function formatToDisplay(date) {
    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
}

export {formatToValidDate, formatToDisplay};
