<?php

namespace App\Http\Controllers\V1\OperationDepartment\Statement;

use App\Models\Statement;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadController extends Controller
{
    public function handle(Statement $statement): Response | StreamedResponse
    {
        try {
            $zip = new \ZipArchive();
            $zipFile = 'tmp/statements/media.zip';

            if (!Storage::disk('local')->exists('tmp/statements'))
                Storage::disk('local')->makeDirectory('tmp/statements');

            if (Storage::disk('local')->exists($zipFile))
                Storage::disk('local')->delete($zipFile);

            if ($zip->open(Storage::disk('local')->path($zipFile), \ZIPARCHIVE::CREATE) !== true)
                throw new \DomainException('Невозможно создать архив!');

            foreach (glob(Storage::path($statement->getMediaPath()) . '/' . $statement->id . '_*') as $item) {
                $tmp = explode('/', $item);
                $zip->addFile($item, $tmp[count($tmp) - 1]);
            }
            $zip->close();
        }
        catch (\Exception $exception) {
            return new Response($exception->getMessage(), 500);
        }

        return Storage::download($zipFile);
    }
}
