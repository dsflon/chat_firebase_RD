/*

MeganeTemplate

Version: 4.1.0
Website: http://megane-template.com/
License: Dentsu Isobar All Rights Reserved.

*/
export default class jJsonRequest {

    constructor(option) {

        this.request = new XMLHttpRequest();

        this.type = option.type ? option.type : null;
        // this.data_this.type = option.dataType ? option.dataType : null;
        this.url = option.url ? option.url : null;
        this.dataType = option.dataType ? option.dataType : "json";
        this.timeout = option.timeout ? option.timeout : 10000;
        this.data = option.data ? option.data : null;
        this.sccess = option.success ? option.success : null;
        this.postError = option.error ? option.error : null;
        this.timeoutError = option.timeoutError ? option.timeoutError : null;

    }

    Start() {

        this.request.open(this.type, this.url, true);
        this.request.timeout = this.timeout;

        this.request.onload = (e) => {

        	if (this.request.readyState === 4) {
        		if ( 200 <= this.request.status && this.request.status < 400 ) {
                    this.sccess( JSON.parse(this.request.responseText) )
        		} else {
                    this.postError( this.request.statusText )
        		}
        	} else {
                this.postError( this.request.statusText )
            }

        };
        this.request.onerror = (e) => {
            this.postError( this.request.statusText )
        };
        this.request.ontimeout = (e) => {
            this.timeoutError( this.request.statusText )
        };


        if( this.data && (this.type == "POST" || this.type == "post") ) {

            var typeFormData = this.data.constructor.name == "FormData";

            if( typeFormData || this.dataType == "from" ) {
                // this.request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded');
                this.request.send(this.data);
            } else {
                this.request.setRequestHeader( 'Content-Type', 'application/json');
                this.request.send(JSON.stringify(this.data));
            }

        } else {
            this.request.send(null);
        }

    }

}
