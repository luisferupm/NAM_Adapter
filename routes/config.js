/**
 *    File:         config/config.js
 *
 *    Author:       Luis Fernando Garcia 
 *    				Jose Gonzalez
 *                  Universidad Politéctica de Madrid (UPM)
 *
 *    Date:         07/10/2014
 *
 *    Description:  XIMM-NAM Adapter - 
 *
 *    License:
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the following copyright notice,
 *       this list of conditions and the disclaimer below.
 * 
 *        Copyright (c) 2003-2008, Universidad Politécnica de Madrid (UPM)
 * 
 *                              All rights reserved.
 * 
 *     * Redistribution in binary form must reproduce the above copyright notice,
 *       this list of conditions and the following disclaimer in the documentation
 *       and/or other materials provided with the distribution.
 * 
 *    *  Neither the name of Universidad Politécnica de Madrid nor the names of its 
 *       contributors may be used to endorse or promote products derived from this 
 *       software without explicit prior written permission.
 * 
 * You are under no obligation whatsoever to provide any enhancements to Universidad 
 * Politécnica de Madrid,or its contributors.  If you choose to provide your enhance-
 * ments, or if you choose to otherwise publish or distribute your enhancement, in 
 * source code form without contemporaneously requiring end users to enter into a 
 * separate written license agreement for such enhancements, then you thereby grant 
 * Universidad Politécnica de Madrid, its contributors, and its members a non-exclusive, 
 * royalty-free, perpetual license to copy, display, install, use, modify, prepare 
 * derivative works, incorporate into the software or other computer software, dis-
 * tribute, and sublicense your enhancements or derivative works thereof, in binary 
 * and source code form.
 * 
 * DISCLAIMER - THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * “AS IS” AND WITH ALL FAULTS.  THE UNIVERSIDAD POLITECNICA DE MADRID, ITS CONTRI-
 * BUTORS, AND ITS MEMBERS DO NOT IN ANY WAY WARRANT, GUARANTEE, OR ASSUME ANY RES-
 * PONSIBILITY, LIABILITY OR OTHER UNDERTAKING WITH RESPECT TO THE SOFTWARE. ANY E-
 * XPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRAN-
 * TIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT
 * ARE HEREBY DISCLAIMED AND THE ENTIRE RISK OF SATISFACTORY QUALITY, PERFORMANCE,
 * ACCURACY, AND EFFORT IS WITH THE USER THEREOF.  IN NO EVENT SHALL THE COPYRIGHT
 * OWNER, CONTRIBUTORS, OR THE UNIVERSITY CORPORATION FOR ADVANCED INTERNET DEVELO-
 * PMENT, INC. BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTIT-
 * UTE GOODS OR SERVICES; REMOVAL OR REINSTALLATION LOSS OF USE, DATA, SAVINGS OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILIT-
 * Y, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHE-
 * RWISE) ARISING IN ANY WAY OUT OF THE USE OR DISTRUBUTION OF THIS SOFTWARE, EVEN
 * IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */


/**
 * config file
 */


//Host Identification
var federation = "XIFI"
  , regionId = "Madrid"	// Proceed to change this value for your concrete regionId
  , hostId = "0001";

// IP addresses
var ip_address = {	local_ip: "192.168.1.130", 
					public_ip : "127.0.0.1",
					private_federation_ip : "10.0.1.2"};  // Proceed to change this value for your concrete IP addresses

// NAM parameters

var bdw_status = true
  , owd_status = true
  , lossp_status = true
  , port_NAM_Adapter = 3000			// Proceed to change this value for the NAM port that you want use.
  , port_iperf_server = 5001		// Proceed to change this value for the iperf port that you want use.
  , ntp_server = "hora.rediris.es"
  , NGSIAdapter_url = "http://localhost:5000/";	// Proceed to change this value for your concrete NGSI 

// OWD Scheduler

var limit_scheduledTest = 6;

var owd_endpoint_default = {
		regionId: 	"Madrid",
		hostId: 	"0001",
		frequency:  480,     // minutes
		type: "owd"
	};


// BDW Scheduler
var bdw_endpoint_default = {
		regionId: 	"Madrid",
		hostId: 	"0001",
		frequency:  480,				// minutes
		type:  "bdw"
	};



//DB Global
//url access DB Regions, hosts and services NAM

var ls_global = "http://localhost:3000/monitoring";

var host_data = {
	  	  hostId: hostId,
	  	  regionId: regionId,
	  	  type: "vm",
	  	  ipAddress: ip_address.public_ip,
	  	  ip_address: ip_address,

	  	  port_NAM: port_NAM_Adapter,
	  	  ping_status: true,
	  	  bdw_status: bdw_status,
	  	  owd_status: owd_status,
	  	  BDW_endpoint_dest_schedule: [ bdw_endpoint_default ],

	  	  OWD_endpoint_dest_schedule: [ owd_endpoint_default ]
	  		
	  };

var config = {};	

config.federation = federation;
config.regionId = regionId;
config.hostId = hostId;
config.ipAddress_Public = ip_address.public_ip;
config.ip_address = ip_address;
config.port_API = port_NAM_Adapter;
config.port_iperf_server = port_iperf_server;


config.host_data = host_data;

config.ntp_server = ntp_server;
config.limit_scheduledTest = limit_scheduledTest;
config.owd_endpoint_default = owd_endpoint_default;
config.bdw_endpoint_default = bdw_endpoint_default;
config.ls_global = ls_global;
config.NGSIadapterurl = NGSIAdapter_url;
config.account_host = 'https://account.lab.fi-ware.org';

config.keystone_host = 'cloud.lab.fi-ware.org';
config.keystone_port = 4731;


config.username = 'pepProxy';
config.password = 'pepProxy';
config.userIDM = 'NAMadapter';
config.passIDM = 'namadapter';

module.exports = config;