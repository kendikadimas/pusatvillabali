<?php

namespace App\Http\Requests\Settings;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PasswordUpdateRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User $user */
        $user = $this->user();

        // Google-only users (no user-set password yet) skip current_password check
        $currentPasswordRules = ($user && $user->isGoogleAccount())
            ? []
            : ['current_password' => $this->currentPasswordRules()];

        return array_merge($currentPasswordRules, [
            'password' => $this->passwordRules(),
        ]);
    }
}
