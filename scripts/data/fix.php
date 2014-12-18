<?php
$industries = array(16, 35);
foreach ($industries as $i) {
  echo "Processing industry $i\r\n";
  $file = getcwd() . '/industries/industry_' . $i . '.json';
  $content = file_get_contents($file);
  $content = json_decode($content);

  echo '<pre>';
  print_r($content);
  echo '</pre>';

  $a = array();
  foreach($content->accounts as $account) {
    $a[] = $account;
  }

  $content->accounts = $a;

  $file = getcwd() . '/parsed/industry_' . $i . '.json';
  file_put_contents($file, json_encode($content));
}
