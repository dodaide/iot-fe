import { format, parseISO } from 'date-fns'

export function formatDate(dateTime) {
    const parsedDate = parseISO(dateTime)
    const formattedDate = format(parsedDate, "HH:mm:ss - dd/MM/yyyy")
    return formattedDate
}

export function UperFirstChar(str) {
    if(!str)
        return str
    if(str === 'id')
        return str.toUpperCase()
    const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalizedStr;
}