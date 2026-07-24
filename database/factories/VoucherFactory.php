<?php

namespace Database\Factories;

use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoucherFactory extends Factory
{
    protected $model = Voucher::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('VOUCHER-####')),
            'description' => fake()->sentence(),
            'discount_type' => $type = fake()->randomElement(['percentage', 'fixed']),
            'discount_value' => $type === 'percentage'
                ? fake()->randomElement([10, 15, 20, 25, 50])
                : fake()->randomElement([50000, 75000, 100000]),
            'min_booking_amount' => 500000,
            'max_discount' => null,
            'usage_limit' => null,
            'used_count' => 0,
            'is_active' => true,
            'valid_from' => now()->subDay(),
            'valid_until' => now()->addMonth(),
        ];
    }

    public function percent(float $value = 10, ?float $maxDiscount = null): static
    {
        return $this->state(fn () => [
            'discount_type' => 'percentage',
            'discount_value' => $value,
            'max_discount' => $maxDiscount,
        ]);
    }

    public function fixed(float $value = 50000): static
    {
        return $this->state(fn () => [
            'discount_type' => 'fixed',
            'discount_value' => $value,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'valid_from' => now()->subMonth(),
            'valid_until' => now()->subDay(),
        ]);
    }
}
