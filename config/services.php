<?php


/**
 * File name: services.php
 * Last modified: 2020.06.11 at 16:03:23
 * Author: SmarterVision - https://codecanyon.net/user/smartervision
 * Copyright (c) 2020
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => env('SES_REGION', 'us-east-1'),
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\Models\User::class,
    ],

    'facebook' => [
        'client_id' => '2088483311467392',         // Your Facebook Client ID
        'client_secret' => '4fb7bff52d8eb13041f6fc59030e4b62', // Your Facebook Client Secret
        'redirect' => 'https://multi-markets.smartersvision.com/public/login/facebook/callback',
    ],

    'google' => [
        'client_id' => env('82474335906-d91t055jtmn6mt0t4uf6r5b2hkrp42i9.apps.googleusercontent.com'),
        'client_secret' => env('ewoNNK8YK7HHsC1FkEiChy5j'),
        'redirect' => 'http://127.0.0.1:8000/login/google/callback',
    ],


    'twitter' => [
        'client_id' => '',         // Your twitter Client ID
        'client_secret' => '', // Your twitter Client Secret
        'redirect' => 'https://multi-markets.smartersvision.com/public/login/twitter/callback',
    ],

    'braintree' => [
        'model'  => App\Models\User::class,
        'environment' => env('BRAINTREE_ENV'),
        'merchant_id' => env('BRAINTREE_MERCHANT_ID'),
        'public_key' => env('BRAINTREE_PUBLIC_KEY'),
        'private_key' => env('BRAINTREE_PRIVATE_KEY'),
    ],

    'razorpay' => [
        'key' => 'rzp_test_yltsH9jI7Y5gFo',
        'secret' => '9km0kMtOjh00nIHjlzaDK6Hc'
    ],

    'fcm' => [
        'key' => '',
    ]

];