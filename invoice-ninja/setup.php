<?php
/**
 * ============================================================================
 * MiForge - Invoice Ninja post-setup (runs ONCE inside the `ninja-setup`
 * container, bootstrapped against /var/www/app).
 *
 * What it does (each step is isolated, so one failure doesn't abort the rest):
 *   1. Company -> name "MiForge", currency USD
 *   2. Offline payment methods: Cash, CashApp, Venmo, Chime, Check, Whop
 *   3. 3 clients + 3 invoices matching the NocoDB CRM seed data
 *
 * PREREQUISITE: complete the first-run setup once in the browser at
 *   http://localhost:8083  (login admin@miforge.local / miforge-dev-2025)
 * then re-run:  docker compose up --force-recreate ninja-setup
 * (or ./invoice-ninja/setup.sh from the repo root).
 *
 * If any step prints [warn], finish that piece in the UI - everything is
 * also documented in README-LOCAL.md.
 * ============================================================================
 */

error_reporting(E_ALL & ~E_DEPRECATED & ~E_WARNING & ~E_NOTICE);

$app = require '/var/www/app/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Client;
use App\Models\ClientContact;
use App\Models\Company;
use App\Models\CompanyGateway;
use App\Models\Currency;
use App\Models\Gateway;
use App\Models\Invoice;
use App\Models\User;

function step(string $name, callable $fn): void
{
    try {
        $fn();
        echo "[ok]   $name\n";
    } catch (Throwable $e) {
        echo "[warn] $name: " . $e->getMessage() . "\n";
    }
}

$company = Company::query()->first();
if (!$company) {
    echo "[warn] No company yet - complete first-run setup at http://localhost:8083 first.\n";
    exit(1);
}
$user = User::query()->where('is_admin', true)->first() ?: User::query()->first();

// 1. Company: MiForge + USD ---------------------------------------------------
step('company name = MiForge, currency = USD', function () use ($company) {
    $company->name = 'MiForge';
    $usd = Currency::query()->where('code', 'USD')->first();
    if ($usd) {
        $company->currency_id = $usd->id;
    }
    $settings = $company->settings;
    if ($usd) {
        $settings->currency_id = $usd->id;
    }
    $company->settings = $settings;
    $company->save();
});

// 2. Offline payment methods --------------------------------------------------
$methods = [
    'Cash'    => 'cash',
    'CashApp' => 'cashapp',
    'Venmo'   => 'venmo',
    'Chime'   => 'chime',
    'Check'   => 'check',
    'Whop'    => 'whop',
];
foreach ($methods as $label => $key) {
    step("payment method: $label", function () use ($company, $user, $label, $key) {
        Gateway::query()->firstOrCreate(
            ['key' => $key],
            ['name' => $label, 'provider' => $key, 'is_offline' => true, 'is_secure' => false, 'visible' => true, 'sort_order' => 99]
        );
        CompanyGateway::query()->firstOrCreate(
            ['company_id' => $company->id, 'gateway_key' => $key],
            [
                'user_id'                  => $user ? $user->id : 0,
                'require_cvv'              => false,
                'require_billing_address'  => false,
                'require_shipping_address' => false,
                'token_billing'            => false,
            ]
        );
    });
}

// 3. Clients matching the CRM seed --------------------------------------------
$clientsData = [
    ['name' => 'Bruce',          'email' => 'bruce@example.com',       'phone' => '904-555-0141', 'balance' => 0.00,   'paid_to_date' => 150.00],
    ['name' => 'Margaret',       'email' => 'margaret@example.com',    'phone' => '904-555-0187', 'balance' => 200.00, 'paid_to_date' => 400.00],
    ['name' => 'Robert & Diane', 'email' => 'robert.diane@example.com','phone' => '904-555-0122', 'balance' => 0.00,   'paid_to_date' => 0.00],
];
$clients = [];
foreach ($clientsData as $c) {
    step("client: {$c['name']}", function () use ($company, $user, $c, &$clients) {
        $client = Client::query()->firstOrCreate(
            ['company_id' => $company->id, 'name' => $c['name']],
            [
                'user_id'       => $user ? $user->id : 0,
                'phone'         => $c['phone'],
                'balance'       => $c['balance'],
                'paid_to_date'  => $c['paid_to_date'],
                'currency_id'   => $company->currency_id,
            ]
        );
        ClientContact::query()->firstOrCreate(
            ['client_id' => $client->id, 'email' => $c['email']],
            [
                'company_id' => $company->id,
                'first_name' => explode(' ', $c['name'])[0],
                'send_email' => true,
                'is_primary' => true,
            ]
        );
        $clients[$c['name']] = $client;
    });
}

// 4. Invoices matching the CRM seed -------------------------------------------
$invoicesData = [
    [
        'number' => 'INV-2026-001', 'client' => 'Bruce',    'date' => '2026-09-12', 'due' => '2026-09-12',
        'amount' => 150.00, 'notes' => 'Session visit - book inventory system (3 hours). Paid in cash on site.',
        'paid' => true, 'method' => 'Cash',
    ],
    [
        'number' => 'INV-2026-002', 'client' => 'Margaret', 'date' => '2026-10-01', 'due' => '2026-10-15',
        'amount' => 200.00, 'notes' => 'Partnership - October 2026.',
        'paid' => true, 'method' => 'Venmo',
    ],
    [
        'number' => 'INV-2026-003', 'client' => 'Margaret', 'date' => '2026-10-18', 'due' => '2026-11-01',
        'amount' => 200.00, 'notes' => 'Partnership - November 2026. Follow up by phone if unpaid by due date.',
        'paid' => false, 'method' => null,
    ],
];
foreach ($invoicesData as $invData) {
    step("invoice: {$invData['number']}", function () use ($company, $user, $clients, $invData) {
        $client = $clients[$invData['client']] ?? null;
        if (!$client) {
            throw new RuntimeException("client {$invData['client']} missing");
        }
        $inv = Invoice::query()->firstOrCreate(
            ['company_id' => $company->id, 'number' => $invData['number']],
            [
                'user_id'      => $user ? $user->id : 0,
                'client_id'    => $client->id,
                'date'         => $invData['date'],
                'due_date'     => $invData['due'],
                'public_notes' => $invData['notes'],
                'status_id'    => $invData['paid'] ? Invoice::STATUS_PAID : Invoice::STATUS_SENT,
            ]
        );
        $inv->line_items = [[
            'type_id'     => 1,
            'product_key' => $invData['number'],
            'notes'       => $invData['notes'],
            'cost'        => $invData['amount'],
            'qty'         => 1,
        ]];
        $inv->save();
        if (method_exists($inv, 'service')) {
            $inv->service()->calc()->save();
        }
        if ($invData['paid'] && $invData['method']) {
            // best-effort payment record so the invoice shows as settled
            $key = strtolower(str_replace(' ', '_', $invData['method']));
            $typeId = \App\Models\PaymentType::query()->where('key', $key)->value('id')
                ?: \App\Models\PaymentType::query()->where('key', 'cash')->value('id');
            if ($typeId && class_exists(\App\Models\Payment::class)) {
                \App\Models\Payment::query()->firstOrCreate(
                    [
                        'company_id' => $company->id,
                        'client_id'  => $client->id,
                        'invoice_id' => $inv->id,
                    ],
                    [
                        'user_id'        => $user ? $user->id : 0,
                        'amount'         => $invData['amount'],
                        'type_id'        => $typeId,
                        'date'           => $invData['date'],
                        'transaction_reference' => $invData['number'],
                        'status_id'      => \App\Models\Payment::STATUS_COMPLETED,
                    ]
                );
            }
        }
    });
}

echo "ninja-setup: done (review [warn] lines above if any).\n";
exit(0);
