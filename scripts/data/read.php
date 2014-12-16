<?php
header('Content-type: application/json');

if ($_GET['dir'] === 'parsed') {
  $dir = 'parsed';
}
else {
  $dir = 'industries';
}

echo file_get_contents(getcwd() . "/{$dir}/industry_{$_GET['i']}.json");
