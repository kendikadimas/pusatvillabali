import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:42
 * @route '/auth/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/auth/callback',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:42
 * @route '/auth/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:42
 * @route '/auth/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:42
 * @route '/auth/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:42
 * @route '/auth/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:42
 * @route '/auth/callback'
 */
        callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:42
 * @route '/auth/callback'
 */
        callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callback.form = callbackForm
/**
* @see \App\Http\Controllers\OAuthController::exchangeCode
 * @see app/Http/Controllers/OAuthController.php:64
 * @route '/auth/exchange-code'
 */
export const exchangeCode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exchangeCode.url(options),
    method: 'post',
})

exchangeCode.definition = {
    methods: ["post"],
    url: '/auth/exchange-code',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OAuthController::exchangeCode
 * @see app/Http/Controllers/OAuthController.php:64
 * @route '/auth/exchange-code'
 */
exchangeCode.url = (options?: RouteQueryOptions) => {
    return exchangeCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OAuthController::exchangeCode
 * @see app/Http/Controllers/OAuthController.php:64
 * @route '/auth/exchange-code'
 */
exchangeCode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: exchangeCode.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OAuthController::exchangeCode
 * @see app/Http/Controllers/OAuthController.php:64
 * @route '/auth/exchange-code'
 */
    const exchangeCodeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: exchangeCode.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OAuthController::exchangeCode
 * @see app/Http/Controllers/OAuthController.php:64
 * @route '/auth/exchange-code'
 */
        exchangeCodeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: exchangeCode.url(options),
            method: 'post',
        })
    
    exchangeCode.form = exchangeCodeForm
const auth = {
    callback: Object.assign(callback, callback),
exchangeCode: Object.assign(exchangeCode, exchangeCode),
}

export default auth