<?php

namespace Folk\Controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Folk\Admin;
use Folk\Entities\EntityInterface;

class InsertEntity extends Entity
{
    public function html(Request $request, Response $response, Admin $app, $entityName)
    {
        return $app['templates']->render('pages/insert', [
            'entityName' => $entityName,
            'form' => static::createForm($app, $entityName),
        ]);
    }
}
