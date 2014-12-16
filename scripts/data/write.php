<?php
if (!isset($argv[1]))
  die('You should pass the key the first argument.');

function print_object($object) {
  echo '<pre>';
  print_r($object);
  echo '</pre>';
}

/* gets the data from a URL */
function get_data($url) {
  $ch = curl_init();
  $timeout = 5;
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
  $data = curl_exec($ch);
  curl_close($ch);
  return $data;
}

$industries_fields = array(
  'slug',
  'value'
);

$industry_fields = array(
  'accounts.id',
  'accounts.name',
  'accounts.efficiency',
  'accounts.impact',
  'accounts.responsiveness',
  'accounts.evalue',
);

echo "Fetching industries list.\n";
$base_url = 'http://analytics.evaluesuite.com/api';
$url  = $base_url . '/tag_facebook??filters[]=category,contains,industries';
$url .= '&fields=';
$url .= implode(',', $industries_fields);

$industries = json_decode(get_data($url));
$tindustries = count($industries->data);
$cindustry = 1;

foreach($industries->data as $industry1) {
  $industry = $industry1;
  $url  = $base_url . "/tag_facebook/{$industry->slug}";
  $url .= '?fields=' . implode(',', $industry_fields);
  $accounts = json_decode(get_data($url));
  $accounts = $accounts->accounts;
  // $url .= '&sort=accounts.evalue,asc&count=100'; // does not work...

  // Sort by evalue, only get first 100
  $evalue = array();
  foreach ($accounts as $key => $row){
    $evalue[$key] = $row->evalue;
  }
  array_multisort($evalue, SORT_DESC, $accounts);
  if (count($accounts) > 100) {
    $accounts = array_slice($accounts, 0, 100);
  }

  $industry->accounts = $accounts;

  $taccounts = count($industry->accounts);
  $caccount = 1;

  foreach($industry->accounts as $account) {
    echo "Fetching industry {$cindustry} of {$tindustries}, account {$caccount} of {$taccounts}.\n";
    $url = $base_url . "/account_facebook/{$account->id}/snapshot?fields=fans_country&key={$argv[1]}";
    $fans_country = json_decode(get_data($url));
    $account->fans_country = $fans_country->fans_country;
    $caccount++;
    sleep(1); // in microseconds, half a second
  }

  // Save to file after now
  $path = getcwd() . "/industries/industry_{$cindustry}.json";
  $file = file_put_contents($path, json_encode($industry));

  $cindustry++;
  sleep(1); // in microseconds, half a second
}

// $path = getcwd() . '/evalue_industries.json';
// $file = file_put_contents($path, json_encode($industries));
