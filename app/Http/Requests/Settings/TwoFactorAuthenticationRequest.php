<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Laravel\Fortify\Features;
use Laravel\Fortify\InteractsWithTwoFactorState;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TwoFactorAuthenticationRequest extends FormRequest
{
    use InteractsWithTwoFactorState;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }

    /**
     * Ensure the user's password has been recently confirmed.
     *
     * @return void
     *
     * @throws HttpException
     */
    public function ensureStateIsValid()
    {
        if (! Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')) {
            return;
        }

        $user = $this->user();
        if (! $user) {
            redirect()->guest(route('password.confirm'))->throwResponse();
        }

        $confirmedAt = $this->session()->get('auth.password_confirmed_at', 0);
        $timeout = config('auth.password_timeout', 10800);

        if (time() - $confirmedAt > $timeout) {
            redirect()->guest(route('password.confirm'))->throwResponse();
        }
    }
}
