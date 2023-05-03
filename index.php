<?php

declare(strict_types = 1);
header('Content-Type: application/json');
spl_autoload_register(function ($class){
	require __DIR__ . "/srcPhp/$class.php";
});

set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");

$parts = explode("/", $_SERVER["REQUEST_URI"]);
header('Content-Type: application/json;');
if( !isset($parts[1]) || ($parts[4] != "post" && $parts[4] != "comment")) {
	http_response_code(404);
	echo json_encode(["error" => "URL Not found"]);
	exit;
}

$id = $parts[5] ?? null;

$database = new Database("localhost", "VrandecicD", "VrandecicD", "VrandecicD_2022");

switch($parts[4]) {
	case "post": 
		$postGateway = new PostGateway($database);
		$postController = new PostController($postGateway);
		$postController->processRequest($_SERVER["REQUEST_METHOD"], $id);
		break;
	case "comment":
		$commentGateway = new CommentGateway($database);
		$commentController = new CommentController($commentGateway);
		$commentController->processRequest($_SERVER["REQUEST_METHOD"], $id);
		break;
	default:
	break;
}

