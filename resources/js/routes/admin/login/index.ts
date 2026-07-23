import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::submit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:28
 * @route '/admin/login'
 */
export const submit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/admin/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::submit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:28
 * @route '/admin/login'
 */
submit.url = (options?: RouteQueryOptions) => {
    return submit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::submit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:28
 * @route '/admin/login'
 */
submit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::submit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:28
 * @route '/admin/login'
 */
    const submitForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::submit
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:28
 * @route '/admin/login'
 */
        submitForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(options),
            method: 'post',
        })
    
    submit.form = submitForm
const login = {
    submit: Object.assign(submit, submit),
}

export default login