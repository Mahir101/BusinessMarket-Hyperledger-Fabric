
//we can set animation delay as following in ms (default 1000)
var x = 'Order Received';
//var y=retr;
var y=2;
if (y=='1') {
  x ='Order Received';
}
if (y=='2') {
  x = 'Processing';
}
if (y=='3') {
  x = 'In Transit';
}
if (y=='4') {
  x = 'Product in Warehouse';
}
if (y=='5') {
  x = 'Delivered';
}

ProgressBar.singleStepAnimation = 1000;
ProgressBar.init(
  [ 'Order Received',
    'Processing',
    'In Transit',
    'Product in warehouse',
    'Delivered',
  ],
  x,
  'progress-bar-wrapper' // created this optional parameter for container name (otherwise default container created)
);