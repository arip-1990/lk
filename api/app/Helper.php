<?php

namespace App;

use Illuminate\Support\Collection;

class Helper
{
    public static function formatSchedule(Collection $schedule, bool $long = false): string
    {
        $str = '';
        if ($long) {
            $week = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
            foreach ($schedule as $key => $value) {
                $str .= $week[$key] . ': ';

                if($value['open'] == $value['close'])
                    $str .= 'Круглосуточно';
                else
                    $str .= 'с ' . $value['open'] . ' до ' . $value['close'];

                $str .= '<br>';
            }
        }
        else {
            $week = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
            $last = ['open' => '', 'close' => ''];
            $periods = [];
            $index = -1;
            foreach ($schedule as $key => $value) {
                if($last['open'] == $value['open'] && $last['close'] == $value['close']) {
                    $periods[$index]['end'] = $key;
                }
                else{
                    $index++;
                    $periods[$index]['begin'] = $key;
                    $periods[$index]['open'] = $value['open'];
                    $periods[$index]['close'] = $value['close'];
                }

                $last = ['open' => $value['open'], 'close' => $value['close']];
            }

            $roundClock = 0;
            foreach ($periods as $day) {
                $str .= $week[$day['begin']] . (isset($day['end']) ? '-' . $week[$day['end']] : '') . ': ';

                if($day['open'] == $day['close']) {
                    $str .= 'Круглосуточно';
                    $roundClock++;
                }
                else
                    $str .= 'с ' . $day['open'] . ' до ' . $day['close'];

                $str .= '<br>';
            }

            if (count($periods) === $roundClock)
                $str = 'Круглосуточно';
        }

        return $str;
    }

    public static function formatPhone(?string $phone, bool $isMobile = false): string
    {
        $tmp = '';
        if ($phone = ltrim($phone, '+')) {
            if ($isMobile) {
                $phone = substr_replace($phone, ') ' . substr($phone, 4), 4);
                $phone = substr_replace($phone, ' (' . substr($phone, 1), 1);
                $phone = substr_replace($phone, '-' . substr($phone, -4), -4);
                $phone = substr_replace($phone, '-' . substr($phone, -2), -2);
                $tmp = '+' . $phone;
            }
            else {
                $phone = str_replace('8722', ' (8722) ', $phone);
                $tmp = '+' . substr_replace($phone, '-' . substr($phone, -3), -3);
            }
        }

        return $tmp;
    }

    public static function trimPrefixCity(string $city): ?string
    {
        return preg_replace('/^(г|пос|мкр|пгт|с)[. ]+/', '', trim($city));
    }

    public static function trimPrefixStreet(string $street): ?string
    {
        return preg_replace('/^(пр|ул|д)[. ]+/', '', trim($street));
    }
}
