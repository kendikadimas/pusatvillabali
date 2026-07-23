import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::newMethod
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:157
 * @route '/admin/villas/new'
 */
export const newMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(options),
    method: 'get',
})

newMethod.definition = {
    methods: ["get","head"],
    url: '/admin/villas/new',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::newMethod
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:157
 * @route '/admin/villas/new'
 */
newMethod.url = (options?: RouteQueryOptions) => {
    return newMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::newMethod
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:157
 * @route '/admin/villas/new'
 */
newMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::newMethod
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:157
 * @route '/admin/villas/new'
 */
newMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::newMethod
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:157
 * @route '/admin/villas/new'
 */
    const newMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::newMethod
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:157
 * @route '/admin/villas/new'
 */
        newMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::newMethod
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:157
 * @route '/admin/villas/new'
 */
        newMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newMethod.form = newMethodForm
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::edit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:167
 * @route '/admin/villas/{id}/edit'
 */
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/villas/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::edit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:167
 * @route '/admin/villas/{id}/edit'
 */
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::edit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:167
 * @route '/admin/villas/{id}/edit'
 */
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::edit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:167
 * @route '/admin/villas/{id}/edit'
 */
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::edit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:167
 * @route '/admin/villas/{id}/edit'
 */
    const editForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::edit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:167
 * @route '/admin/villas/{id}/edit'
 */
        editForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::edit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:167
 * @route '/admin/villas/{id}/edit'
 */
        editForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const villas = {
    new: Object.assign(newMethod, newMethod),
edit: Object.assign(edit, edit),
}

export default villas