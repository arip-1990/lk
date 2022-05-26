<?php

namespace App\Http\Controllers\V1\Media;

use App\Models\Media;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadController extends Controller
{
    public function handle(): Response | StreamedResponse
    {
        try {
            $zip = new \ZipArchive();
            $zipFile = 'tmp/media/media.zip';

            if (!Storage::disk('local')->exists('tmp/media'))
                Storage::disk('local')->makeDirectory('tmp/media');

            if (Storage::disk('local')->exists($zipFile))
                Storage::disk('local')->delete($zipFile);

            if ($zip->open(Storage::disk('local')->path($zipFile), \ZIPARCHIVE::CREATE) !== true)
                throw new \DomainException('Невозможно создать архив!');

            foreach (Media::all() as $media) {
                $newPath = 'Медиа/' . ($media?->store->name ?? 'Все');
                foreach (Storage::files($media->getMediaPath()) as $file) {
                    $tmp = explode('/', $file);
                    $zip->addFromString($newPath . '/' . array_pop($tmp), Storage::get($file));
                }
            }
            $zip->close();
        }
        catch (\Exception $exception) {
            return new Response($exception->getMessage(), 500);
        }

        return Storage::disk('local')->download($zipFile);
    }
}
