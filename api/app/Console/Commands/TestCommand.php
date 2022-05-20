<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestCommand extends Command
{
    protected $signature = 'test';
    protected $description = 'Тестовая команда';

    public function handle(): int
    {
        return 0;
    }
}
