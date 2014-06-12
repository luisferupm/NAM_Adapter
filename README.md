
# NAM Adapter

NAM Adapter is the component in charge of the Network Active Monitoring data within the XIFI Infrastructure Monitoring Middleware (XIMM) (initial description and concepts provided in the [deliverable D3.1- XIFI infrastructure adaptation components API open specification] (http://wiki.fi-xifi.eu/Public:D3.1)). This component provides a multi-domain monitoring mechanism able to handle latency and bandwidth-related tests along a set of points of interest within the federated community. 

## Install

### Installation Requirements

The main recommendation to install the NAM Adapter is to deploy the software package on a host with Ubuntu/ Debian running as Operating System. If this was not the case, it would be necessary to check how to install additional packages that are required. NAM's software repository has been successfully tested with versions 12.10 and 13.10 of Ubuntu, and version 7.3 of Debian. No major issues are expected for upcoming versions. 

In order to work properly, the component requires the following set of software modules: 

* Node.js
* MongoDB
* NTP
* Iperf
The required software can be installed manually from the default Debian/Ubuntu repositories by using the following command:

```
 $ sudo apt-get install iperf
```

###  Installation of the NAM Adapter in Debian/Ubuntu

For install nam adapter uses the following command:

```
sudo npm nam_adapter
```

## Usage

### Request an On-Demand Test between endpoints
A Call instance resource represents a measure between a host A and host B. The following parameters are needed to run Test On-Demand (OWD or BDW):

    * URI: http://{hostServerNAM}:{portNAM}/monitoring/host2hosts/{serviceType}/{regionId_Source}-{hostId_Source};{regionId_Destination}-{hostId_Destination} 

    * Method: GET 

    * Content-Type: Application/JSON 

    * Query string parameters: ?format=XML/JSON/TXT 

    * Request body: none 


Example of usage: 

```
curl --header "{my-token}" "http://138.4.47.33:3000/monitoring/host2hosts/owd/Trento-193.205.211.69;Waterford-193.1.202.133"
```

## Developing



### Tools

