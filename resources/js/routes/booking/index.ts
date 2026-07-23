import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Web\BookingWebController::confirm
 * @see app/Http/Controllers/Web/BookingWebController.php:17
 * @route '/booking/confirm'
 */
export const confirm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirm.url(options),
    method: 'get',
})

confirm.definition = {
    methods: ["get","head"],
    url: '/booking/confirm',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\BookingWebController::confirm
 * @see app/Http/Controllers/Web/BookingWebController.php:17
 * @route '/booking/confirm'
 */
confirm.url = (options?: RouteQueryOptions) => {
    return confirm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\BookingWebController::confirm
 * @see app/Http/Controllers/Web/BookingWebController.php:17
 * @route '/booking/confirm'
 */
confirm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: confirm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\BookingWebController::confirm
 * @see app/Http/Controllers/Web/BookingWebController.php:17
 * @route '/booking/confirm'
 */
confirm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: confirm.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\BookingWebController::confirm
 * @see app/Http/Controllers/Web/BookingWebController.php:17
 * @route '/booking/confirm'
 */
    const confirmForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: confirm.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\BookingWebController::confirm
 * @see app/Http/Controllers/Web/BookingWebController.php:17
 * @route '/booking/confirm'
 */
        confirmForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirm.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\BookingWebController::confirm
 * @see app/Http/Controllers/Web/BookingWebController.php:17
 * @route '/booking/confirm'
 */
        confirmForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: confirm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    confirm.form = confirmForm
/**
* @see \App\Http\Controllers\Web\BookingWebController::payment
 * @see app/Http/Controllers/Web/BookingWebController.php:46
 * @route '/booking/payment'
 */
export const payment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(options),
    method: 'get',
})

payment.definition = {
    methods: ["get","head"],
    url: '/booking/payment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\BookingWebController::payment
 * @see app/Http/Controllers/Web/BookingWebController.php:46
 * @route '/booking/payment'
 */
payment.url = (options?: RouteQueryOptions) => {
    return payment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\BookingWebController::payment
 * @see app/Http/Controllers/Web/BookingWebController.php:46
 * @route '/booking/payment'
 */
payment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: payment.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\BookingWebController::payment
 * @see app/Http/Controllers/Web/BookingWebController.php:46
 * @route '/booking/payment'
 */
payment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: payment.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\BookingWebController::payment
 * @see app/Http/Controllers/Web/BookingWebController.php:46
 * @route '/booking/payment'
 */
    const paymentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: payment.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\BookingWebController::payment
 * @see app/Http/Controllers/Web/BookingWebController.php:46
 * @route '/booking/payment'
 */
        paymentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payment.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\BookingWebController::payment
 * @see app/Http/Controllers/Web/BookingWebController.php:46
 * @route '/booking/payment'
 */
        paymentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: payment.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    payment.form = paymentForm
/**
* @see \App\Http\Controllers\Web\BookingWebController::status
 * @see app/Http/Controllers/Web/BookingWebController.php:69
 * @route '/booking/status'
 */
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/booking/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\BookingWebController::status
 * @see app/Http/Controllers/Web/BookingWebController.php:69
 * @route '/booking/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\BookingWebController::status
 * @see app/Http/Controllers/Web/BookingWebController.php:69
 * @route '/booking/status'
 */
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\BookingWebController::status
 * @see app/Http/Controllers/Web/BookingWebController.php:69
 * @route '/booking/status'
 */
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\BookingWebController::status
 * @see app/Http/Controllers/Web/BookingWebController.php:69
 * @route '/booking/status'
 */
    const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\BookingWebController::status
 * @see app/Http/Controllers/Web/BookingWebController.php:69
 * @route '/booking/status'
 */
        statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\BookingWebController::status
 * @see app/Http/Controllers/Web/BookingWebController.php:69
 * @route '/booking/status'
 */
        statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
/**
* @see \App\Http\Controllers\Web\BookingWebController::success
 * @see app/Http/Controllers/Web/BookingWebController.php:87
 * @route '/booking/success'
 */
export const success = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})

success.definition = {
    methods: ["get","head"],
    url: '/booking/success',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\BookingWebController::success
 * @see app/Http/Controllers/Web/BookingWebController.php:87
 * @route '/booking/success'
 */
success.url = (options?: RouteQueryOptions) => {
    return success.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\BookingWebController::success
 * @see app/Http/Controllers/Web/BookingWebController.php:87
 * @route '/booking/success'
 */
success.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\BookingWebController::success
 * @see app/Http/Controllers/Web/BookingWebController.php:87
 * @route '/booking/success'
 */
success.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: success.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\BookingWebController::success
 * @see app/Http/Controllers/Web/BookingWebController.php:87
 * @route '/booking/success'
 */
    const successForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: success.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\BookingWebController::success
 * @see app/Http/Controllers/Web/BookingWebController.php:87
 * @route '/booking/success'
 */
        successForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\BookingWebController::success
 * @see app/Http/Controllers/Web/BookingWebController.php:87
 * @route '/booking/success'
 */
        successForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: success.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    success.form = successForm
/**
* @see \App\Http\Controllers\Web\BookingWebController::failed
 * @see app/Http/Controllers/Web/BookingWebController.php:104
 * @route '/booking/failed'
 */
export const failed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})

failed.definition = {
    methods: ["get","head"],
    url: '/booking/failed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\BookingWebController::failed
 * @see app/Http/Controllers/Web/BookingWebController.php:104
 * @route '/booking/failed'
 */
failed.url = (options?: RouteQueryOptions) => {
    return failed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\BookingWebController::failed
 * @see app/Http/Controllers/Web/BookingWebController.php:104
 * @route '/booking/failed'
 */
failed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\BookingWebController::failed
 * @see app/Http/Controllers/Web/BookingWebController.php:104
 * @route '/booking/failed'
 */
failed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: failed.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\BookingWebController::failed
 * @see app/Http/Controllers/Web/BookingWebController.php:104
 * @route '/booking/failed'
 */
    const failedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: failed.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\BookingWebController::failed
 * @see app/Http/Controllers/Web/BookingWebController.php:104
 * @route '/booking/failed'
 */
        failedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\BookingWebController::failed
 * @see app/Http/Controllers/Web/BookingWebController.php:104
 * @route '/booking/failed'
 */
        failedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    failed.form = failedForm
/**
* @see \App\Http\Controllers\Web\InvoiceController::invoice
 * @see app/Http/Controllers/Web/InvoiceController.php:14
 * @route '/booking/{code}/invoice'
 */
export const invoice = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})

invoice.definition = {
    methods: ["get","head"],
    url: '/booking/{code}/invoice',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\InvoiceController::invoice
 * @see app/Http/Controllers/Web/InvoiceController.php:14
 * @route '/booking/{code}/invoice'
 */
invoice.url = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return invoice.definition.url
            .replace('{code}', parsedArgs.code.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\InvoiceController::invoice
 * @see app/Http/Controllers/Web/InvoiceController.php:14
 * @route '/booking/{code}/invoice'
 */
invoice.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoice.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\InvoiceController::invoice
 * @see app/Http/Controllers/Web/InvoiceController.php:14
 * @route '/booking/{code}/invoice'
 */
invoice.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoice.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\InvoiceController::invoice
 * @see app/Http/Controllers/Web/InvoiceController.php:14
 * @route '/booking/{code}/invoice'
 */
    const invoiceForm = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: invoice.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\InvoiceController::invoice
 * @see app/Http/Controllers/Web/InvoiceController.php:14
 * @route '/booking/{code}/invoice'
 */
        invoiceForm.get = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoice.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\InvoiceController::invoice
 * @see app/Http/Controllers/Web/InvoiceController.php:14
 * @route '/booking/{code}/invoice'
 */
        invoiceForm.head = (args: { code: string | number } | [code: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: invoice.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    invoice.form = invoiceForm
/**
* @see \App\Http\Controllers\Web\BookingWebController::review
 * @see app/Http/Controllers/Web/BookingWebController.php:121
 * @route '/review'
 */
export const review = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(options),
    method: 'get',
})

review.definition = {
    methods: ["get","head"],
    url: '/review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\BookingWebController::review
 * @see app/Http/Controllers/Web/BookingWebController.php:121
 * @route '/review'
 */
review.url = (options?: RouteQueryOptions) => {
    return review.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\BookingWebController::review
 * @see app/Http/Controllers/Web/BookingWebController.php:121
 * @route '/review'
 */
review.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: review.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Web\BookingWebController::review
 * @see app/Http/Controllers/Web/BookingWebController.php:121
 * @route '/review'
 */
review.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: review.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Web\BookingWebController::review
 * @see app/Http/Controllers/Web/BookingWebController.php:121
 * @route '/review'
 */
    const reviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: review.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Web\BookingWebController::review
 * @see app/Http/Controllers/Web/BookingWebController.php:121
 * @route '/review'
 */
        reviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Web\BookingWebController::review
 * @see app/Http/Controllers/Web/BookingWebController.php:121
 * @route '/review'
 */
        reviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: review.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    review.form = reviewForm
const booking = {
    confirm: Object.assign(confirm, confirm),
payment: Object.assign(payment, payment),
status: Object.assign(status, status),
success: Object.assign(success, success),
failed: Object.assign(failed, failed),
invoice: Object.assign(invoice, invoice),
review: Object.assign(review, review),
}

export default booking