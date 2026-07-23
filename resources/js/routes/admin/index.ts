import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import loginDf2c2a from './login'
import villas9680c5 from './villas'
import bookings743b13 from './bookings'
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::login
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:23
 * @route '/admin/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/admin/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::login
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:23
 * @route '/admin/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::login
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:23
 * @route '/admin/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::login
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:23
 * @route '/admin/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::login
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:23
 * @route '/admin/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::login
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:23
 * @route '/admin/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::login
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:23
 * @route '/admin/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::logout
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:65
 * @route '/admin/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/admin/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::logout
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:65
 * @route '/admin/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::logout
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:65
 * @route '/admin/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::logout
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:65
 * @route '/admin/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::logout
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:65
 * @route '/admin/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::dashboard
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:81
 * @route '/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::dashboard
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:81
 * @route '/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::dashboard
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:81
 * @route '/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::dashboard
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:81
 * @route '/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::dashboard
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:81
 * @route '/admin/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::dashboard
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:81
 * @route '/admin/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::dashboard
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:81
 * @route '/admin/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::analytics
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:104
 * @route '/admin/analytics'
 */
export const analytics = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})

analytics.definition = {
    methods: ["get","head"],
    url: '/admin/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::analytics
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:104
 * @route '/admin/analytics'
 */
analytics.url = (options?: RouteQueryOptions) => {
    return analytics.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::analytics
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:104
 * @route '/admin/analytics'
 */
analytics.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: analytics.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::analytics
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:104
 * @route '/admin/analytics'
 */
analytics.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: analytics.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::analytics
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:104
 * @route '/admin/analytics'
 */
    const analyticsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: analytics.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::analytics
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:104
 * @route '/admin/analytics'
 */
        analyticsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::analytics
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:104
 * @route '/admin/analytics'
 */
        analyticsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: analytics.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    analytics.form = analyticsForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::villas
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:109
 * @route '/admin/villas'
 */
export const villas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: villas.url(options),
    method: 'get',
})

villas.definition = {
    methods: ["get","head"],
    url: '/admin/villas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::villas
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:109
 * @route '/admin/villas'
 */
villas.url = (options?: RouteQueryOptions) => {
    return villas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::villas
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:109
 * @route '/admin/villas'
 */
villas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: villas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::villas
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:109
 * @route '/admin/villas'
 */
villas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: villas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::villas
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:109
 * @route '/admin/villas'
 */
    const villasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: villas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::villas
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:109
 * @route '/admin/villas'
 */
        villasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: villas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::villas
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:109
 * @route '/admin/villas'
 */
        villasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: villas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    villas.form = villasForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::bookings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:178
 * @route '/admin/bookings'
 */
export const bookings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookings.url(options),
    method: 'get',
})

bookings.definition = {
    methods: ["get","head"],
    url: '/admin/bookings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::bookings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:178
 * @route '/admin/bookings'
 */
bookings.url = (options?: RouteQueryOptions) => {
    return bookings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::bookings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:178
 * @route '/admin/bookings'
 */
bookings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bookings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::bookings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:178
 * @route '/admin/bookings'
 */
bookings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bookings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::bookings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:178
 * @route '/admin/bookings'
 */
    const bookingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bookings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::bookings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:178
 * @route '/admin/bookings'
 */
        bookingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bookings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::bookings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:178
 * @route '/admin/bookings'
 */
        bookingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bookings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bookings.form = bookingsForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::reviews
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:232
 * @route '/admin/reviews'
 */
export const reviews = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reviews.url(options),
    method: 'get',
})

reviews.definition = {
    methods: ["get","head"],
    url: '/admin/reviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::reviews
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:232
 * @route '/admin/reviews'
 */
reviews.url = (options?: RouteQueryOptions) => {
    return reviews.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::reviews
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:232
 * @route '/admin/reviews'
 */
reviews.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reviews.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::reviews
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:232
 * @route '/admin/reviews'
 */
reviews.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reviews.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::reviews
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:232
 * @route '/admin/reviews'
 */
    const reviewsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reviews.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::reviews
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:232
 * @route '/admin/reviews'
 */
        reviewsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reviews.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::reviews
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:232
 * @route '/admin/reviews'
 */
        reviewsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reviews.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reviews.form = reviewsForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::destinations
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:257
 * @route '/admin/destinations'
 */
export const destinations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destinations.url(options),
    method: 'get',
})

destinations.definition = {
    methods: ["get","head"],
    url: '/admin/destinations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::destinations
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:257
 * @route '/admin/destinations'
 */
destinations.url = (options?: RouteQueryOptions) => {
    return destinations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::destinations
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:257
 * @route '/admin/destinations'
 */
destinations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destinations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::destinations
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:257
 * @route '/admin/destinations'
 */
destinations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: destinations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::destinations
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:257
 * @route '/admin/destinations'
 */
    const destinationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: destinations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::destinations
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:257
 * @route '/admin/destinations'
 */
        destinationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: destinations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::destinations
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:257
 * @route '/admin/destinations'
 */
        destinationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: destinations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    destinations.form = destinationsForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::calendar
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:266
 * @route '/admin/calendar'
 */
export const calendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

calendar.definition = {
    methods: ["get","head"],
    url: '/admin/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::calendar
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:266
 * @route '/admin/calendar'
 */
calendar.url = (options?: RouteQueryOptions) => {
    return calendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::calendar
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:266
 * @route '/admin/calendar'
 */
calendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::calendar
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:266
 * @route '/admin/calendar'
 */
calendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::calendar
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:266
 * @route '/admin/calendar'
 */
    const calendarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: calendar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::calendar
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:266
 * @route '/admin/calendar'
 */
        calendarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calendar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::calendar
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:266
 * @route '/admin/calendar'
 */
        calendarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: calendar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    calendar.form = calendarForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::settings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:275
 * @route '/admin/settings'
 */
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/admin/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::settings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:275
 * @route '/admin/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::settings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:275
 * @route '/admin/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::settings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:275
 * @route '/admin/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::settings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:275
 * @route '/admin/settings'
 */
    const settingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: settings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::settings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:275
 * @route '/admin/settings'
 */
        settingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::settings
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:275
 * @route '/admin/settings'
 */
        settingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    settings.form = settingsForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::users
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:286
 * @route '/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::users
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:286
 * @route '/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::users
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:286
 * @route '/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::users
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:286
 * @route '/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::users
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:286
 * @route '/admin/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::users
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:286
 * @route '/admin/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::users
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:286
 * @route '/admin/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::vouchers
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:291
 * @route '/admin/vouchers'
 */
export const vouchers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vouchers.url(options),
    method: 'get',
})

vouchers.definition = {
    methods: ["get","head"],
    url: '/admin/vouchers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::vouchers
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:291
 * @route '/admin/vouchers'
 */
vouchers.url = (options?: RouteQueryOptions) => {
    return vouchers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::vouchers
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:291
 * @route '/admin/vouchers'
 */
vouchers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vouchers.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::vouchers
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:291
 * @route '/admin/vouchers'
 */
vouchers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vouchers.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::vouchers
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:291
 * @route '/admin/vouchers'
 */
    const vouchersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vouchers.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::vouchers
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:291
 * @route '/admin/vouchers'
 */
        vouchersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vouchers.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::vouchers
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:291
 * @route '/admin/vouchers'
 */
        vouchersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vouchers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vouchers.form = vouchersForm
const admin = {
    login: Object.assign(login, loginDf2c2a),
logout: Object.assign(logout, logout),
dashboard: Object.assign(dashboard, dashboard),
analytics: Object.assign(analytics, analytics),
villas: Object.assign(villas, villas9680c5),
bookings: Object.assign(bookings, bookings743b13),
reviews: Object.assign(reviews, reviews),
destinations: Object.assign(destinations, destinations),
calendar: Object.assign(calendar, calendar),
settings: Object.assign(settings, settings),
users: Object.assign(users, users),
vouchers: Object.assign(vouchers, vouchers),
}

export default admin