<?php

namespace App\Enums;

enum FlashMessageTypes: string
{
    case SUCCESS = 'success';
    case ERROR = 'error';
    case WARNING = 'warning';
    case INFO = 'info';
}
