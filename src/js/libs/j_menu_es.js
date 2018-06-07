/*

MeganeTemplate

Version: 4.1.0
Website: http://megane-template.com/
License: Dentsu Isobar All Rights Reserved.

*/
export default class jMenu {

    constructor(selector, option) {

        this.selector = selector;
        this.menu = document.querySelectorAll( this.selector )[0];

        //option
        if(option == null) option = {};
        this.globalNav = option.globalNav ? option.globalNav : "#globalnav";
        this.activeName = option.activeName ? option.activeName : "active";
        this.closePoint = option.closePoint ? option.closePoint : null;

        this.noScroll = option.noScroll != null ? option.noScroll : true;
        this.globalNavElm = document.querySelectorAll( this.globalNav )[0];

        this.flag = false;
        this.scrollVal = null;
        this.baseWinWidth = window.innerWidth;

        this.OpenEnd = function(){};
        this.CloseEnd = function(){};

        if( this.menu ) {
            this.Init();
        }

    }


    /**
    **
    ** Init
    **
    **/
    Init() {

        var THAT = this;

        this.menu.addEventListener( "click", function() {
            !THAT.flag ? THAT.Open() : THAT.Close();
        } )

        window.addEventListener( "resize", function() {

            var WIN_WIDTH = window.innerWidth;

    		if( THAT.closePoint && THAT.flag ) {

    			if( THAT.baseWinWidth < WIN_WIDTH ) {//右

    				if( (THAT.baseWinWidth < THAT.closePoint) && ( THAT.closePoint < WIN_WIDTH ) ) {
    					THAT.Close();
    				}

    			} else {//左

    				if( (THAT.baseWinWidth > THAT.closePoint) && ( THAT.closePoint > WIN_WIDTH ) ) {
    					THAT.Close();
    				}

    			}
    			THAT.baseWinWidth = WIN_WIDTH;

    		}


        } );

    }


    /**
    **
    ** Open
    **
    **/
    Open(i) {

        if( !this.menu ) {
            console.error( this.selector + ": Not Found" );
            return false;
        }

        var THAT = this;
        this.scrollVal = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

        this.AddClass(this.menu,this.activeName);
        this.AddClass(this.globalNavElm,this.activeName);

        var EndFunc = function() {
            THAT.OpenEnd();
            THAT.globalNavElm.removeEventListener("transitionend", EndFunc);
        };

        this.globalNavElm.addEventListener("transitionend", EndFunc, false);

        if( this.noScroll ) {

            this.htmlTag = document.getElementsByTagName("html")[0];

            var css =  "position: fixed; ";
                css += "width: 100%; ";
                css += "top:"+ (-this.scrollVal) +"px;";

            this.htmlTag.style.cssText = css;

        }

        this.flag = true;

    }


    /**
    **
    ** Close
    **
    **/
    Close() {

        if( !this.menu ) {
            console.error( this.selector + ": Not Found" );
            return false;
        }

        var THAT = this;

        if( this.noScroll ) this.htmlTag.style.position = "static";

        window.scroll( 0, this.scrollVal );

        this.RemoveClass(this.menu,this.activeName);
        this.RemoveClass(this.globalNavElm,this.activeName);

        var EndFunc = function() {
            THAT.CloseEnd();
            THAT.globalNavElm.removeEventListener("transitionend", EndFunc);
        };

        this.globalNavElm.addEventListener("transitionend", EndFunc, false);

        this.flag = false;

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

}
