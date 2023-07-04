<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property string $id
 * @property string $name
 * @property ?string $phone
 * @property Collection $schedule
 * @property integer $sort
 * @property boolean $status
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 *
 * @property ?Company $company
 * @property Collection<User> $users
 * @property Collection<Claim> $claims
 */
class Store extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = [
        'schedule' => AsCollection::class,
    ];
    protected $fillable = ['id', 'name', 'phone', 'schedule', 'sort', 'status'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class);
    }

    public function formatScheduleShort(): string
    {
        $str = '';
        $week = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

        $last = ['open' => '', 'close' => ''];
        $periods = [];
        $index = -1;

        foreach ($this->schedule as $key => $value) {
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

        return $str;
    }

    public function formatScheduleLong(): string
    {
        $str = '';
        $week = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];

        foreach ($this->schedule as $key => $value) {
            $str .= '' . $week[$key] . ' ';

            if($value['open'] == $value['close'])
                $str .= 'Круглосуточно';
            else
                $str .= 'с ' . $value['open'] . ' до ' . $value['close'];

            $str .= '<br>';
        }

        return $str;
    }
}
