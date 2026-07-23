import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\VillaWebController::index
 * @see app/Http/Controllers/Web/VillaWebController.php:15
 * @route '/villas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/villas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\VillaWebController::index
 * @see app/Http/Controllers/Web/VillaWebController.php:15
 * @route '/villas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\VillaWebController::index
 * @see app/Http/Controllers/Web/VillaWebController.php:15
 * @route '/villas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\VillaWebController::index
 * @see app/Http/Controllers/Web/VillaWebController.php:15
 * @route '/villas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\VillaWebController::index
 * @see app/Http/Controllers/Web/VillaWebController.php:15
 * @route '/villas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\VillaWebController::index
 * @see app/Http/Controllers/Web/VillaWebController.php:15
 * @route '/villas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\VillaWebController::index
 * @see app/Http/Controllers/Web/VillaWebController.php:15
 * @route '/villas'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Web\VillaWebController::byDestination
 * @see app/Http/Controllers/Web/VillaWebController.php:80
 * @route '/villas/explore'
 */
export const byDestination = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDestination.url(options),
    method: 'get',
})

byDestination.definition = {
    methods: ["get","head"],
    url: '/villas/explore',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\VillaWebController::byDestination
 * @see app/Http/Controllers/Web/VillaWebController.php:80
 * @route '/villas/explore'
 */
byDestination.url = (options?: RouteQueryOptions) => {
    return byDestination.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\VillaWebController::byDestination
 * @see app/Http/Controllers/Web/VillaWebController.php:80
 * @route '/villas/explore'
 */
byDestination.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDestination.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\VillaWebController::byDestination
 * @see app/Http/Controllers/Web/VillaWebController.php:80
 * @route '/villas/explore'
 */
byDestination.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byDestination.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\VillaWebController::byDestination
 * @see app/Http/Controllers/Web/VillaWebController.php:80
 * @route '/villas/explore'
 */
    const byDestinationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byDestination.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\VillaWebController::byDestination
 * @see app/Http/Controllers/Web/VillaWebController.php:80
 * @route '/villas/explore'
 */
        byDestinationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDestination.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\VillaWebController::byDestination
 * @see app/Http/Controllers/Web/VillaWebController.php:80
 * @route '/villas/explore'
 */
        byDestinationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDestination.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byDestination.form = byDestinationForm
/**
* @see \App\Http\Controllers\Web\VillaWebController::show
 * @see app/Http/Controllers/Web/VillaWebController.php:125
 * @route '/villas/{slug}'
 */
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/villas/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\VillaWebController::show
 * @see app/Http/Controllers/Web/VillaWebController.php:125
 * @route '/villas/{slug}'
 */
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    slug: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        slug: args.slug,
                }

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\VillaWebController::show
 * @see app/Http/Controllers/Web/VillaWebController.php:125
 * @route '/villas/{slug}'
 */
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\VillaWebController::show
 * @see app/Http/Controllers/Web/VillaWebController.php:125
 * @route '/villas/{slug}'
 */
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\VillaWebController::show
 * @see app/Http/Controllers/Web/VillaWebController.php:125
 * @route '/villas/{slug}'
 */
    const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\VillaWebController::show
 * @see app/Http/Controllers/Web/VillaWebController.php:125
 * @route '/villas/{slug}'
 */
        showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\VillaWebController::show
 * @see app/Http/Controllers/Web/VillaWebController.php:125
 * @route '/villas/{slug}'
 */
        showForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const villas = {
    index: Object.assign(index, index),
byDestination: Object.assign(byDestination, byDestination),
show: Object.assign(show, show),
}

export default villas