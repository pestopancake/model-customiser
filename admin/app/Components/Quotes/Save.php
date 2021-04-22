<?php

namespace App\Components\Quotes;

use App\Models\Quote;
use Redbastie\Tailwire\Component;
use Redbastie\Tailwire\View;

class Save extends Component
{
    public $quote;

    public function view(View $v)
    {
        return $v->if(
            $this->show,
            fn () => $v->section(
                $v->form(
                    $v->div(
                        $v->h1($this->viewTitle)->class('text-xl'),
                        $v->button($v->icon('x'))->wireClick('toggleShow')->class('text-gray-500 w-5 h-5')
                    )->class('flex items-center justify-between px-6 py-4'),

                    $v->div(
                        $v->div(
                            $v->label('Name')->for('name'),
                            $v->input()->id('name')->wireModelDefer('name')
                                ->class(($this->error('name') ? 'border-red-500' : 'border-gray-300') . ' rounded-lg w-full'),
                            $v->if($this->error('name'), fn () => $v->p($this->error('name'))->class('text-xs text-red-600'))
                        )->class('space-y-1'),
                    )->class('space-y-4 p-6'),

                    $v->div(
                        $v->div(
                            $v->label('Email')->for('email'),
                            $v->input()->id('email')->wireModelDefer('email')
                                ->class(($this->error('email') ? 'border-red-500' : 'border-gray-300') . ' rounded-lg w-full'),
                            $v->if($this->error('email'), fn () => $v->p($this->error('email'))->class('text-xs text-red-600'))
                        )->class('space-y-1'),
                    )->class('space-y-4 p-6'),

                    $v->div(
                        $v->button('Cancel')->wireClick('toggleShow')->class('text-white bg-gray-500 rounded-lg px-3 py-2'),
                        $v->button('Save')->type('submit')->class('text-white bg-blue-600 rounded-lg px-3 py-2')
                    )->class('flex justify-end space-x-4 px-6 py-4'),
                )->wireSubmitPrevent('save')->class('bg-white rounded-lg shadow divide-y max-w-screen-sm mx-auto')
            )->class('fixed inset-0 bg-black bg-opacity-50 overflow-y-auto p-4')
        );
    }

    public function save()
    {
        $validated = $this->validate([
            'name' => ['required'],
            'email' => ['required'],
        ]);

        if ($this->quote->exists) {
            $this->quote->update($validated);
        } else {
            Quote::create($validated);
        }

        $this->emitUp('$refresh');
        $this->toggleShow();
    }

    public function show(Quote $quote = null)
    {
        $this->viewTitle = $quote->exists ? 'Update Quote' : 'Create Quote';
        $this->model = $quote->toArray();
        $this->quote = $quote;

        $this->toggleShow();
    }
}
