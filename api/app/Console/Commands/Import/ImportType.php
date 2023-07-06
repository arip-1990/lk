<?php

namespace App\Console\Commands\Import;

enum ImportType: string
{
    case STORE = 'store';
    case USER = 'user';
}
