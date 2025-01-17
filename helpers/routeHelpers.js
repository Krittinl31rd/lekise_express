function isActiveRoute(route, currentRoute) {
    return route === currentRoute ? "text-gray-900 bg-white dark:bg-black dark:text-white" :
        "text-gray-900 dark:text-white";
}

module.exports = { isActiveRoute };