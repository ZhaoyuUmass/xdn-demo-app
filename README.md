Prerequisites: `nodejs`, `npm`, `docker`, `Java 1.8+`, `ant`

This is a demo NodeJS app implemented for [XDN](https://github.com/ZhaoyuUmass/xdn).


## Obtaining code
Source:
```
git clone https://github.com/ZhaoyuUmass/xdn-demo-app
cd xdn-demo-app
npm install
```

## Tutorial
This tutorial illustrates how to run this app with different setups. The ultimate goal is to run it with [XDN](https://github.com/ZhaoyuUmass/xdn).

### Run as a Standalone App
Run the NodeJS server:
```
node app.js
```
Open the link with your browser: [http://localhost:3000/xdnapp](http://localhost:3000/xdnapp)
Interact with the web app, you will see the app is a counter that simply adds the input value to its current value.


### Run as a Docker app
The up-to-date docker image of this app can be found on [DockerHub](https://hub.docker.com/repository/docker/oversky710/xdn-demo-app).
The detailed process to build the image can be found here: [XDN-API](http://date.cs.umass.edu/gaozy/xdn-api.html)

Run the docker as:
```
docker run --name xdn-demo-app -v xdn-demo-app:/tmp -p 80:3000 -e HOST=172.17.0.1 -d oversky710/xdn-demo-app 
```
Open the link with your browser to view the web app: [http://localhost/xdnapp](http://localhost/xdnapp)

To clean up:
```
docker stop -t 0 xdn-demo-app
docker rm xdn-demo-app
```

### Run as an XDN app
This app is an XDN app that you can use XDN to create a service name to manage. The benefit to use XDN to manage your app is that you can develop your application as if it's a standalone app running on a single machine. XDN is responsible for the state management of the app, e.g., replicate app's state on multiple replicas, reconfigure the running app to the optimal location to end users. 
This tutorial only focuses on how to run this app with XDN, therefore, we only provide a simple instruction on how to run a standalone XDN server. Please find more details on how to run XDN in a distributed manner from [XDN](https://github.com/ZhaoyuUmass/xdn).

To run a standalone XDN, first obtain and build from XDN source code:
```
git clone https://github.com/ZhaoyuUmass/xdn
cd xdn
ant jar
```

To start a server:
```
script/gpServer.sh -DgigapaxosConfig=conf/xdn.local.properties start all
```

To start the app:
```
script/gpClient.sh -DgigapaxosConfig=conf/xdn.local.properties \
-DappConfig=conf/app/service.properties edu.umass.cs.xdn.tools.CreateServiceClient
```

The app information is in the config file `conf/app/service.properties`:
```
NAME=www
IMAGE_NAME=xdn-demo-app
IMAGE_URL=oversky710/xdn-demo-app
DOCKER_PORT=3000
```

Open the link with your browser to view the app: [http://localhost/xdnapp](http://localhost/xdnapp)

Now you can send a request to your app through XDN:
```
script/gpClient.sh -DgigapaxosConfig=conf/xdn.local.properties \
-DappConfig=conf/app/service.properties edu.umass.cs.xdn.tools.ExecuteRequestClient
```

Open the link again to view the new value of the app: [http://localhost/xdnapp](http://localhost/xdnapp)

To clean up:
```
script/gpServer.sh -DgigapaxosConfig=conf/xdn.local.properties forceclear all
./script/cleanup.sh
```
