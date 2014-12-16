<?php
for ($i = 1; $i <= 56; $i++) {
  echo "Processing industry $i\r\n";
  $file = getcwd() . '/industries/industry_' . $i . '.json';
  $content = file_get_contents($file);
  $content = json_decode($content);

  $totalFans = new stdClass();
  $sourcemap = array();

  // Count numbers of fan per country in all accounts
  foreach ($content->accounts as $account) {
    foreach ($account->fans_country as $country => $fans) {
      if (array_key_exists($country, $totalFans)) {
        $totalFans->$country += $fans;
      }
      else {
        $totalFans->$country = $fans;
      }
      $sourcemap[$country][] = $account->id;
    }
  }

  $content->total_fans = $totalFans;
  $content->sourcemap = $sourcemap;

  $file = getcwd() . '/parsed/industry_' . $i . '.json';
  file_put_contents($file, json_encode($content));
}
