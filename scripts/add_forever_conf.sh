#!/bin/sh

mkdir -p /etc/forever
chmod 777 /etc/forever # Need access for all users, otherwise forever process is not controlable

# Centos
# echo -e "#!/bin/sh\nexport FOREVER_ROOT=/etc/forever\n" > /etc/profile.d/forever.sh
# chmod +x /etc/profile.d/forever.sh

