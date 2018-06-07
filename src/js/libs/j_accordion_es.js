/*

MeganeTemplate

Version: 4.1.0
Website: http://megane-template.com/
License: Dentsu Isobar All Rights Reserved.

*/
export default class jAccordion {

    constructor(selector, option) {

        this.selector = selector;
        this.accordion = document.querySelectorAll( this.selector );

        //option
        if(option == null) option = {};
        this.toggleSpeed = option.toggleSpeed ? option.toggleSpeed : 1;
        this.btnElm = option.btnElm ? option.btnElm : ".j-accordion_btn";
        this.detailElm = option.detailElm ? option.detailElm : ".j-accordion_detail";

        this.OpenEnd = function(){};
        this.CloseEnd = function(){};

        this.clickFlag = false;

        if (this.accordion[0]) {
            this.Init();
        }
    }

    /**
    **
    ** Init
    **
    **/
    Init() {

        let initCss = "overflow: hidden;";
            initCss += "transition: max-height " + this.toggleSpeed/1000 +"s ;";
            initCss += "-webkit-transition: max-height " + this.toggleSpeed/1000 +"s ;";

        for (var i = 0; i < this.accordion.length; i++) {

            const DETAIL = this.accordion[i].querySelectorAll(this.detailElm);
            const BTN = this.accordion[i].querySelectorAll(this.btnElm);

            for (var j = 0; j < BTN.length; j++) {

                if( DETAIL[j] ) {
                    DETAIL[j].style.cssText = initCss;
                    if( !this.HasClass( DETAIL[j], "active" ) ) {
                        DETAIL[j].style.maxHeight = "0px";
                        DETAIL[j].style.display = "none";
                    }
                }

                BTN[j].addEventListener( "click", ( e ) => {

                    e.preventDefault();

                    this.Toggle( e );

                });

            }

        }

    }


    /**
    **
    ** Toggle
    **
    **/
    Toggle( element ) {

        if(!this.accordion[0]) {
            console.error( this.selector + ": Not Found" );
            return false;
        }

        const TARGET = element.currentTarget ? element.currentTarget : document.querySelectorAll( element )[0];

        if( this.HasClass( TARGET, "active" ) ){

            if( !this.clickFlag ) this.Close( element );

        } else {

            if( !this.clickFlag ) this.Open( element );

        }

    }


    /**
    **
    ** Open, Close
    **
    **/
    Open(element) {

        if(!this.accordion[0]) {
            console.error( this.selector + ": Not Found" );
            return false;
        }

        this.clickFlag = true;

        const TARGET = element.currentTarget ? element.currentTarget : document.querySelectorAll( element )[0];
        const PARENT = this.GetParent( TARGET, this.selector );

        const INDEX = Array.prototype.indexOf.call( PARENT.querySelectorAll( this.btnElm ), TARGET );

        const TARGET_DETAIL = PARENT.querySelectorAll( this.detailElm )[ INDEX ];
        const EndFunc = () => {
            this.clickFlag = false;
            this.OpenEnd( INDEX );
            TARGET_DETAIL.style.maxHeight = null;
            TARGET_DETAIL.removeEventListener("transitionend", EndFunc);
        };

        this.AddClass(TARGET,"active");
        this.AddClass(TARGET_DETAIL,"active");

        TARGET_DETAIL.style.display = "block";
        setTimeout( function() { TARGET_DETAIL.style.maxHeight = TARGET_DETAIL.scrollHeight + "px"; }, 100);

        if( !this.accordion[0].classList ) {
            this.clickFlag = false;
        } else {
            TARGET_DETAIL.addEventListener("transitionend", EndFunc, false);
        }

    }

    Close( element ) {

        if(!this.accordion[0]) {
            console.error( this.selector + ": Not Found" );
            return false;
        }

        this.clickFlag = true;

        const TARGET = element.currentTarget ? element.currentTarget : document.querySelectorAll( element )[0];
        const PARENT = this.GetParent( TARGET, this.selector );

        const INDEX = Array.prototype.indexOf.call( PARENT.querySelectorAll( this.btnElm ), TARGET );

        const TARGET_DETAIL = PARENT.querySelectorAll( this.detailElm )[ INDEX ];
        const EndFunc = () => {
            this.clickFlag = false;
            this.CloseEnd( INDEX );
            TARGET.style.pointerEvents = "inherit";
            TARGET_DETAIL.style.display = "none";
            TARGET_DETAIL.removeEventListener("transitionend", EndFunc);
        };

        //

        this.RemoveClass(TARGET,"active");
        this.RemoveClass(TARGET_DETAIL,"active");

        TARGET_DETAIL.style.maxHeight = TARGET_DETAIL.scrollHeight + "px";
        setTimeout( function() { TARGET_DETAIL.style.maxHeight = "0px"; }, 100);

        if( !this.accordion[0].classList ) { //IE9

            TARGET_DETAIL.style.display = "none";
            this.clickFlag = false;

        } else {

            TARGET_DETAIL.addEventListener("transitionend", EndFunc, false);

        }

    }

    CloseIgnoreThis( element ) {

        if(!this.accordion[0]) {
            console.error( this.selector + ": Not Found" );
            return false;
        }

        const TARGET = element;
        const PARENT = this.GetParent( TARGET, this.selector );

        const INDEX = Array.prototype.indexOf.call( PARENT.querySelectorAll( this.btnElm ), TARGET );

        const TARGET_BTN = PARENT.querySelectorAll( this.btnElm );
        const TARGET_DETAIL = PARENT.querySelectorAll( this.detailElm );

        for (var i = 0; i < TARGET_BTN.length; i++) {

            if( i != INDEX ) {
                TARGET_BTN[i].classList.remove("active");
                Close_( i );
            }

        }

        //

        function Close_( i ) {

            TARGET_DETAIL[i].classList.remove("active");

            setTimeout( () => { TARGET_DETAIL[i].style.maxHeight = "0px"; }, 100);

        }

    }


    /**
    **
    ** GetParent
    **
    **/
    GetParent( element, target ) {

        let parent = element,
            i = 0,
            t;

        if ( target.split(".")[1] ) {

            t = target.split(".")[1];

        } else if ( target.split("#")[1] ) {

            t = target.split("#")[1];

        } else {

            t = target;

        }

        while ( i < 100 ){

            parent = parent.parentNode;

            if( parent.tagName.toLowerCase() == t ) break;

            if( parent.className ) {
                if( parent.className.match( t ) ) break;
            } else if( parent.id ) {
                if( parent.id.match( t ) ) break;
            }

            i++;

        }

        return parent;

    }

    AddClass( element, _className ) {

        if (element.classList) {
            element.classList.add(_className);
        } else {
            element.className += ' ' + _className;
        }

    }
    RemoveClass( element, _className ) {

        if (element.classList) {
            element.classList.remove(_className);
        } else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + _className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }

    }
    HasClass( element, _className ) {

        var ignore = false;

        if (element.classList) {
            if( element.classList.contains(_className) ) ignore = true;
        } else {
            if( new RegExp('(^| )' + _className + '( |$)', 'gi').test( element.className ) ) ignore = true;
        }

        return ignore;

    }


}
