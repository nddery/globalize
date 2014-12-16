<?php
for ($i = 1; $i <= 56; $i++) {
  echo "Processing industry $i\r\n";
  $file = getcwd() . '/industries/industry_' . $i . '.json';
  $content = file_get_contents($file);
  $content = json_decode($content);

  foreach ($content->accounts as $account) {
    $high = 0;
    $low = INF;

    foreach ($account->fans_country as $country => $fans) {
      unset($account->fans_country->OTHER);
    }

    // Find high / low
    foreach ($account->fans_country as $country => $fans) {
      if ($fans > $high) {
        $high = $fans;
      }

      if ($fans < $low) {
        $low = $fans;
      }
    }

    foreach ($account->fans_country as $country => $fans) {
      // convert form low/high to 0/100
      $converted = ((($fans - $low) * (100 - 1)) / ($high - $low)) + 1;
      $account->fans_country->$country = intval($converted);
    }
  }

  $file = getcwd() . '/parsed/industry_' . $i . '.json';
  file_put_contents($file, json_encode($content));
}
