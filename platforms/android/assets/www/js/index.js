/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        document.addEventListener('pause', this.onPause.bind(this), false);
        document.addEventListener('resume', this.onResume.bind(this), false);
        this.checkNetWorkState(true);        
        this.receivedEvent('deviceready');

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        console.log('Received Event: ' + id);
 
    },

    //Check the network state to close aplication if there's not any type of connection  to the internet.
    //TRUE: If any connection not found close de aplication
    // FALSE/NOTHIG: If any connection not found notify the user 
    checkNetWorkState: function(closeAplication=false){
        // Connection.UNKNOWN
        // Connection.ETHERNET
        // Connection.WIFI
        // Connection.CELL_2G
        // Connection.CELL_4G
        // Connection.CELL_3G
        // Connection.CELL
        // Connection.NONE
        if(navigator.connection.type === Connection.NONE && closeAplication)
        {
            alert("No estas conectado a internet, conectese y vuelva a abrir la aplicación.");
            navigator.app.exitApp();

        }else if(navigator.connection.type === Connection.NONE){
            alert("No estas conectado a internet, puede que la aplicación no funcione correctamente.");
        }else{//handler when there is an connection

        }
    },

    onResume: function() {
    // Handle the resume event
        this.checkNetWorkState(true);
    },

    onPause: function() {
    // Handle the pause event
    // this.checkNetWorkState(true);
    }
};

app.initialize();