function format(date) {
    const dayMonthYear = date.split('/');

    return `${ dayMonthYear[2] }-${ dayMonthYear[1] }-${ dayMonthYear[0] }`;
}

export default format;