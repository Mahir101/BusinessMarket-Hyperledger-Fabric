./killFabric.sh
./startFabric.sh

cd javascript

rm -rf wallet

node enrollAdmin.js
node registerUser.js
node invoke.js
node query.js 
