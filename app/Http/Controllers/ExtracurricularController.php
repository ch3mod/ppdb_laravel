<?php

namespace App\Http\Controllers;

use App\Models\Extracurricular;
use App\Models\ExtracurricularPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class ExtracurricularController extends Controller
{
    public function index(): Response
    {
        return inertia('Admin/Extracurricular/Index', [
            'extracurriculars' => Extracurricular::with('photos')->orderBy('sort_order')->orderBy('name')->get()->map(function (Extracurricular $item) {
                $item->photos->each(fn ($photo) => $photo->setAttribute('url', Storage::disk('public')->url($photo->path)));
                return $item;
            }),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['image', 'max:5120'],
        ]);

        $extracurricular = Extracurricular::create($validated);
        $this->storePhotos($request, $extracurricular);

        return back()->with('success', 'Ekstrakurikuler berhasil ditambahkan.');
    }

    public function update(Request $request, Extracurricular $extracurricular): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'icon' => ['required', 'string', 'max:50'],
            'color' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['image', 'max:5120'],
        ]);

        $extracurricular->update($validated);
        $this->storePhotos($request, $extracurricular);

        return back()->with('success', 'Ekstrakurikuler berhasil diperbarui.');
    }

    public function destroy(Extracurricular $extracurricular): RedirectResponse
    {
        foreach ($extracurricular->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $extracurricular->delete();

        return back()->with('success', 'Ekstrakurikuler berhasil dihapus.');
    }

    public function destroyPhoto(ExtracurricularPhoto $photo): RedirectResponse
    {
        Storage::disk('public')->delete($photo->path);
        $photo->delete();

        return back()->with('success', 'Foto berhasil dihapus.');
    }

    private function storePhotos(Request $request, Extracurricular $extracurricular): void
    {
        foreach ($request->file('photos', []) as $file) {
            $extracurricular->photos()->create([
                'path' => $file->store('gallery/extracurriculars', 'public'),
                'sort_order' => $extracurricular->photos()->count(),
            ]);
        }
    }
}
