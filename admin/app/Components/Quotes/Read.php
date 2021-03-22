<?php

namespace App\Components\Quotes;

use App\Models\Quote;
use Redbastie\Tailwire\Component;
use Redbastie\Tailwire\View;

class Read extends Component
{
    public $quote;

    public function view(View $v)
    {
        return $v->if(
            $this->show,
            fn () => $v->section(
                $v->div(
                    $v->div(
                        $v->h1('Quote')->class('text-xl'),
                        $v->button($v->icon('x')->wireClick('toggleShow')->class('text-gray-500 w-5 h-5'))
                    )->class('flex items-center justify-between px-6 py-4'),

                    $v->div(
                        $v->dl(
                            $v->dt('ID')->class('text-xs text-gray-500'),
                            $v->dd($this->quote->id)
                        ),

                        $v->dl(
                            $v->dt('Name')->class('text-xs text-gray-500'),
                            $v->dd($this->quote->name)
                        ),

                        $v->dl(
                            $v->dt('Created At')->class('text-xs text-gray-500'),
                            $v->dd(timezone($this->quote->created_at))
                        ),

                        $v->dl(
                            $v->dt('Updated At')->class('text-xs text-gray-500'),
                            $v->dd(timezone($this->quote->updated_at))
                        ),
                    )->class('space-y-4 p-6'),

                    $v->div(
                        $v->button('Close')->wireClick('toggleShow')->class('text-white bg-gray-500 rounded-lg px-3 py-2')
                    )->class('flex justify-end space-x-4 px-6 py-4'),
                )->class('bg-white rounded-lg shadow divide-y max-w-screen-sm mx-auto')
            )->class('fixed inset-0 bg-black bg-opacity-50 overflow-y-auto p-4')
        );
    }

    public function show(Quote $quote = null)
    {
        $this->quote = $quote;

        $this->toggleShow();
    }
}
