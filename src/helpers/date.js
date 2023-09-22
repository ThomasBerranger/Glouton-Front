function formatToDisplay(date) {
    const [day, month, year] = date.split('/');

    return `${year}-${month}-${day}`;
}

export {formatToDisplay};
