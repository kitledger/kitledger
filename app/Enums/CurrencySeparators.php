<?php

namespace App\Enums;

enum CurrencySeparators :string
{
	case COMMA = ',';
	case DOT = '.';
	case SPACE = ' ';
	case NONE = '';
}
