#!/usr/bin/env bash



echo "=========>test des service avec postman<============ "
newman run https://www.getpostman.com/collections/ceff6588787162e747d3

echo "**************************tests success****************************************"

echo "stop"
read entrer
exit