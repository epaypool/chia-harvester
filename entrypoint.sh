#!/bin/sh

#set -x

cd /chia-blockchain

CHIA_DIR="/root/.chia/mainnet"

. ./activate


# This should run only once
if [ ! -d "$CHIA_DIR/config"  ];then
  if [[ ${testnet} == 'true' ]]; then
     echo "configure testnet"
     chia init
     chia init -c ./ca/testnet
     chia configure --testnet true
  else
     chia init
     chia init -c ./ca/mainnet
  fi
else
  echo "$CHIA_DIR already exists"
fi

if [[ ${testnet} == 'true' ]]; then
  chia configure --set-farmer-peer chiat.epaypool.com:8447
else
  chia configure --set-farmer-peer chiam.epaypool.com:8447
fi

# https://github.com/Chia-Network/chia-blockchain/wiki/FAQ#why-does-my-node-have-no-connections-how-can-i-get-more-connections
chia configure -upnp false

echo "set debug level"
chia configure -log-level ${LOG_LEVEL}

if [[ ${keys} == "generate" ]]; then
  echo "to use your own keys pass them as a text file -v /path/to/keyfile:/path/in/container and -e keys=\"/path/in/container\""
  chia keys generate
else
  echo "Using keys from file!!!"
  chia keys add -f ${keys}
fi

for p in ${plots_dir//:/ }; do
    mkdir -p ${p}
    if [[ ! "$(ls -A $p)" ]]; then
        echo "Plots directory '${p}' appears to be empty, try mounting a plot directory with the docker -v command"
    fi
    chia plots add -d ${p}
done

# we need to replace for docker
sed -i 's/localhost/127.0.0.1/g' ~/.chia/mainnet/config/config.yaml
# allow to connect for plots monitor
sed -i 's/self_hostname: 127.0.0.1/self_hostname: 0.0.0.0/g' ~/.chia/mainnet/config/config.yaml
# we need to correct config to proper target address
sed -i 's/xch_target_address: .*/xch_target_address: txch1z9ne4kgxwwuusfgsqx5s745c7zfd5j70nf46sa7l6je2tgcfwunq2fw63n/g' ~/.chia/mainnet/config/config.yaml

chia start harvester 2>&1 &

mkdir -p /root/.chia/mainnet/log/
touch /root/.chia/mainnet/log/debug.log
tail -f /root/.chia/mainnet/log/debug.log &

# give time to startup chia harvester
sleep 60
node ./monitor/dist/index.js
