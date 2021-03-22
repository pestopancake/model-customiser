<?php

namespace App\Components\Quotes;

use App\Models\Quote;
use Redbastie\Tailwire\Component;
use Redbastie\Tailwire\View;

class Index extends Component
{
    public $routeUri = '/quotes';
    public $routeName = 'quotes';
    public $routeMiddleware = 'auth';
    public $viewTitle = 'Quotes';
    public $viewExtends = 'layouts.app';

    public function view(View $v)
    {
        return $v->section(
            $v->h1($this->viewTitle)->class('text-xl mb-2'),

            $v->div(
                $v->div(
                    $v->icon('search')
                        ->class('absolute left-3 inset-y-0 pointer-events-none text-gray-400 w-4 h-4 my-auto'),
                    $v->input()->type('search')->placeholder('Search')->wireModelDebounce('search')
                        ->class('placeholder-gray-400 border-gray-300 rounded-lg max-w-full pl-9')
                )->class('relative min-w-0'),

                $v->button($v->icon('plus')->class('w-5 h-5'), 'Create')->wireClick('$emitTo', 'quotes.save', 'show')
                    ->class('flex items-center text-white bg-blue-600 rounded-lg px-3 py-2')
            )->class('flex justify-between space-x-4 mb-4'),

            $v->div(
                $v->each(
                    $this->query()->paginate($this->perPage),
                    fn (Quote $quote) => $v->div(
                        $v->ul(
                            $v->li($quote->name),
                            $v->li(timezone($quote->created_at))->class('text-xs text-gray-500')
                        )->class('md:flex-1'),

                        $v->div(
                            $v->button($v->icon('eye'))->wireClick('$emitTo', 'quotes.read', 'show', $quote->id)
                                ->class('text-blue-600 w-5 h-5'),
                            $v->button($v->icon('pencil-alt'))->wireClick('$emitTo', 'quotes.save', 'show', $quote->id)
                                ->class('text-blue-600 w-5 h-5'),
                            $v->button($v->icon('trash'))->wireClick('delete', $quote->id)->confirm('Delete this Quote?')
                                ->class('text-blue-600 w-5 h-5')
                        )->class('flex space-x-3')
                    )->class('md:flex items-center hover:bg-gray-50 space-y-4 md:space-y-0 md:space-x-6 px-6 py-4')
                )->empty(
                    fn () => $v->p('No Quotes found.')->class('px-6 py-4')
                )
            )->class('bg-white rounded-lg shadow divide-y overflow-hidden'),

            $v->if(
                $this->query()->count() > $this->perPage,
                fn () => $v->infiniteScroll(
                    $v->icon('refresh')->class('animate-spin text-gray-400 w-5 h-5 mx-auto')
                )->class('mt-4')
            ),

            $v->include('quotes.read'),
            $v->include('quotes.save'),
        );
    }

    public function query()
    {
        $query = Quote::query();

        if ($this->model('search')) {
            $query->where('name', 'like', '%' . $this->model('search') . '%');
        }

        return $query->orderBy('name');
    }

    public function delete(Quote $quote)
    {
        $quote->delete();
    }
}
