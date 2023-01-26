wrong version of python

temporarily install python2.7

> python3 -m pip install --user virtualenv
> python3 -m virtualenv --help
> python3 -m virtualenv courm-test --python python2 --creator builtin
> 


Change default python to python2
> sudo ln -sf python2 /usr/bin/python

Change it back to python3
> sudo ln -sf python3 /usr/bin/python

attempt 3:
using python2.7.18, node 12.22.12, npm 6...