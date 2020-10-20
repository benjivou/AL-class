#!/usr/bin/env bash

echo "=========>test des algorithmes et fonctions internes<============ "
npm test
echo "**************************tests success****************************************"

echo "=========>test de bout en bout avec frontend backend<============ "
newman run https://www.getpostman.com/collections/474d4c5c78ea10b45d28

echo "**************************tests success****************************************"

echo "stop"
read entrer
exit
