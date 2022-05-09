module.exports.getAttributeFilters = (params, table) => {
    if (params && params.filter) {
        if (params.filter.includes(",")) {
            return params.filter.split(',').map(f => { return f })
        } else {
            return [params.filter]
        }
    } else {
        let filters = ''
        switch (table) {
            case 'user':
                filters = ['id', 'username', 'email', 'contacts', 'address', 'first_name', 'last_name', 'isActive'];
                break;
            default:
                break;
        }
        return filters;
    }
}

module.exports.getIncludes = (params) => {
    if (params && params.filter) {
        if (params.filter.includes(",")) {
            return params.filter.split(',').map(f => { return f })
        } else {
            return [params.filter]
        }
    } else {
        let filters = ''
        switch (tableName) {
            case 'user':
                filters = ['id', 'username', 'email', 'contacts'];
                break;
            case 'user':
                filters = ['id', 'username', 'email', 'contacts'];
                break;
            default:
                break;
        }
        return filters;
    }
}