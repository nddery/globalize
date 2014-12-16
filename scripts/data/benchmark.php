<?php
for ($i = 1; $i <= 56; $i++) {
  echo "Processing industry $i\r\n";
  $file = getcwd() . '/industries/industry_' . $i . '.json';
  $content = file_get_contents($file);
  $content = json_decode($content);

  $high = 0;
  $low = INF;

  foreach ($content->total_fans as $country => $fans) {
    unset($content->total_fans->OTHER);
  }

  // Find high / low
  foreach ($content->total_fans as $country => $fans) {
    if ($fans > $high) {
      $high = $fans;
    }

    if ($fans < $low) {
      $low = $fans;
    }
  }

  foreach ($content->total_fans as $country => $fans) {
    // convert form low/high to 0/100
    $converted = ((($fans - $low) * (100 - 1)) / ($high - $low)) + 1;
    $content->total_fans->$country = intval($converted);
  }

  $file = getcwd() . '/parsed/industry_' . $i . '.json';
  file_put_contents($file, json_encode($content));
}
