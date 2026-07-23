import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::detail
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:221
 * @route '/admin/bookings/{id}'
 */
export const detail = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(args, options),
    method: 'get',
})

detail.definition = {
    methods: ["get","head"],
    url: '/admin/bookings/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::detail
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:221
 * @route '/admin/bookings/{id}'
 */
detail.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return detail.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::detail
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:221
 * @route '/admin/bookings/{id}'
 */
detail.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::detail
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:221
 * @route '/admin/bookings/{id}'
 */
detail.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detail.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::detail
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:221
 * @route '/admin/bookings/{id}'
 */
    const detailForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detail.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::detail
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:221
 * @route '/admin/bookings/{id}'
 */
        detailForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detail.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Web\AdminWebController::detail
 * @see app/Http/Controllers/Admin/Web/AdminWebController.php:221
 * @route '/admin/bookings/{id}'
 */
        detailForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detail.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detail.form = detailForm
/**
* @see \App\Http\Controllers\BookingController::ktp
 * @see app/Http/Controllers/BookingController.php:484
 * @route '/admin/bookings/{code}/ktp'
 */
export const ktp = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ktp.url(args, options),
    method: 'get',
})

ktp.definition = {
    methods: ["get","head"],
    url: '/admin/bookings/{code}/ktp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::ktp
 * @see app/Http/Controllers/BookingController.php:484
 * @route '/admin/bookings/{code}/ktp'
 */
ktp.url = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        code: args.code,
                }

    return ktp.definition.url
            .replace('{code}', parsedArgs.code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::ktp
 * @see app/Http/Controllers/BookingController.php:484
 * @route '/admin/bookings/{code}/ktp'
 */
ktp.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ktp.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::ktp
 * @see app/Http/Controllers/BookingController.php:484
 * @route '/admin/bookings/{code}/ktp'
 */
ktp.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ktp.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BookingController::ktp
 * @see app/Http/Controllers/BookingController.php:484
 * @route '/admin/bookings/{code}/ktp'
 */
    const ktpForm = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ktp.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BookingController::ktp
 * @see app/Http/Controllers/BookingController.php:484
 * @route '/admin/bookings/{code}/ktp'
 */
        ktpForm.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ktp.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BookingController::ktp
 * @see app/Http/Controllers/BookingController.php:484
 * @route '/admin/bookings/{code}/ktp'
 */
        ktpForm.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ktp.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ktp.form = ktpForm
/**
* @see \App\Http\Controllers\BookingController::paymentProof
 * @see app/Http/Controllers/BookingController.php:517
 * @route '/admin/bookings/{code}/payment-proof'
 */
export const paymentProof = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentProof.url(args, options),
    method: 'get',
})

paymentProof.definition = {
    methods: ["get","head"],
    url: '/admin/bookings/{code}/payment-proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BookingController::paymentProof
 * @see app/Http/Controllers/BookingController.php:517
 * @route '/admin/bookings/{code}/payment-proof'
 */
paymentProof.url = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { code: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    code: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        code: args.code,
                }

    return paymentProof.definition.url
            .replace('{code}', parsedArgs.code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BookingController::paymentProof
 * @see app/Http/Controllers/BookingController.php:517
 * @route '/admin/bookings/{code}/payment-proof'
 */
paymentProof.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentProof.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BookingController::paymentProof
 * @see app/Http/Controllers/BookingController.php:517
 * @route '/admin/bookings/{code}/payment-proof'
 */
paymentProof.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentProof.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BookingController::paymentProof
 * @see app/Http/Controllers/BookingController.php:517
 * @route '/admin/bookings/{code}/payment-proof'
 */
    const paymentProofForm = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paymentProof.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BookingController::paymentProof
 * @see app/Http/Controllers/BookingController.php:517
 * @route '/admin/bookings/{code}/payment-proof'
 */
        paymentProofForm.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentProof.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BookingController::paymentProof
 * @see app/Http/Controllers/BookingController.php:517
 * @route '/admin/bookings/{code}/payment-proof'
 */
        paymentProofForm.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentProof.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paymentProof.form = paymentProofForm
const bookings = {
    detail: Object.assign(detail, detail),
ktp: Object.assign(ktp, ktp),
paymentProof: Object.assign(paymentProof, paymentProof),
}

export default bookings