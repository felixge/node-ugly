#!/usr/bin/env php
<?php
class Worker {
  public $lastError = null;

  public function __construct() {
    set_error_handler(array($this, 'handleError'));
  }

  public function work() {
    $ref = array();
    
    while($line = rtrim(fgets(STDIN))) {
      $args = json_decode($line, true);
      $fn = array_shift($args);

      foreach ($args as $i => $arg) {
        if (is_string($arg) && strlen($arg) == 40 && array_key_exists($arg, $ref)) {
          $args[$i] = $ref[$arg];
        }
      }

      $reference = null;
      $val = null;
      $output = null;
      $error = null;

      if ($fn == 'eval' || is_callable($fn)) {
        ob_start();
        if ($fn == 'eval') {
          $val = eval($args[0]);
        } else {
          $val = call_user_func_array($fn, $args);
        }
        
        $output = ob_get_clean();

        if (is_resource($val) || is_object($val)) {
          $reference = sha1(uniqid('', true));
          $ref[$reference] = $val;
          $val = (string)$val;
        }

        if ($this->lastError) {
          $error = $this->lastError;
          $this->lastError = null;
        }
      } else {
        $error = 'Unknown function: '.$fn;
      }

      $response = json_encode(compact('val', 'error', 'reference', 'output'))."\n";
      echo $response;
    }
  }

  public function handleError($errno, $errstr) {
    $this->lastError = compact('errno', 'errstr');
  }
}

$worker = new Worker();
$worker->work();
?>