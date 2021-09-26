(function($){
    // "use strict";
    
    $.fn.validate = function(options){
        var _this = this;

        var valid = [];
        getVariables = function(attr,_this){
            return _this.find(attr)
        }
        
        options = $.extend({},options);

        init = function(){
            addEvent(getVariables("button[type=button]",_this),"click",submitButtonClickEvent);
            // addEvent(inputs,"keyup",inputKeyupEvent);
            justOnlyMasking();
        }
        
        addEvent = function($el,event,callback){
            $el.on(event,callback);
        }

        required = function(index,$el){
            if(!$el.val()){
                return {
                    "el":$el,
                    "type":"required",
                    "isValid":false
                };
            }
            else if(Number($($el).attr("minlength")) > $el.val().length){
                return {
                    "el":$el,
                    "type":"min-length",
                    "isValid":false
                };
            }else if(Number($($el).data("maxlength")) < $el.val().length){
                return {
                    "el":$el,
                    "type":"max-length",
                    "isValid":false
                };
            }
            else if($($el).data("email") && !inputmailEvent($($el).val())){
                return {
                    "el":$el,
                    "type":"email",
                    "isValid":false
                };
            }
            else if($($el).data("website") && !inputWebsiteEvent($($el).val())){
                return {
                    "el":$el,
                    "type":"website",
                    "isValid":false
                };
            }
            else if($($el).data("password") && !inputPasswordEvent($($el).val())){
                
                return {
                    "el":$el,
                    "type":"WeakPassord",
                    "isValid":false
                };
            }
            else if($($el).data("checkbox") && !checkboxEvent($el)){
                return {
                    "el":$el,
                    "type":"checkbox",
                    "isValid":false
                };
            }
            else if($($el).data("radio") && !radioButtonEvent($el)){
                var radioBtnName = $('input[name="'+$($el).attr("name")+'"]');
                return {
                    "el":radioBtnName,
                    "type":"radio",
                    "isValid":false
                };
            }
            else if($($el).data("selected") &&  $($el).val() == 0){
                return {
                    "el":$el,
                    "type":"selected",
                    "isValid":false
                };
            }
            else{
                return {
                    "el":$el,
                    "type":"",
                    "isValid":true
                };
            }
        }

        submitButtonClickEvent = function(event){
            getVariables("input,select",_this).each((index,el) => {
                setRequired(index,el);
            });
            if(valid.filter(x=>x.isValid==false).length == 0){
                console.log("valid");
                ajaxRequest();
            }else{
                console.log("isvalid");
                event.preventDefault();
            }
        }

        inputKeyupEvent = function(event){
            getVariables("input",_this).each((index,el) => {
                setRequired(index,el);
            });
        }

        justOnlyMasking = function(){
            [...getVariables("input",_this)].forEach((el) => {
                $(el).data("number") ? addEvent($(el),"input",inputNumberEvent) : undefined
            });

            [...getVariables("input",_this)].forEach((el) => {
                $(el).data("phone") ? addEvent($(el),"input",inputPhoneEvent) : undefined
            });
        }

        setRequired = function(index,el){
            if(Boolean($(el).data("notnull"))){
                let gelenReq = required(index,$(el));
                valid[index] ? valid[index] = gelenReq : valid.push(gelenReq);
                printMessage()
            }
        }

        printMessage = function(){
            valid.forEach(x=>{
                if(!x.isValid){
                    // if($(x.el).attr("type")=="radio")debugger;
                    
                    if($(x.el).next(".err").length == 0){
                        $(x.el).parent().append(`<span class='err required' style="color:red">${getErrorMessage(x.type,x.el)}</span>`)
                    }else{
                        $(x.el).next(".err").text(getErrorMessage(x.type,x.el))
                    }
                }else{
                    $(x.el).next(".err").remove()
                }
            });
        }

        getErrorMessage = function(type,$el){
            switch (type) {
                case "required":
                    return "Boş geçilenemez alan *"
            
                case "min-length":
                    return `min ${$($el).attr("minlength")} karakter olmalı *`
                
                case "max-length":
                    return `max ${$($el).data("maxlength")} karakter olmalı *`
                    
                case "email":
                    return `email standartlarına uygun olmalıdır *`
                
                case "website":
                    return `Web site standartlarına uygun olmalıdır *`
                
                case "WeakPassord":
                    return `Şifre güvenli değil *`

                case "checkbox":
                    return `Seçilmesi gereken alan *`
               
                case "radio":
                    return `En az bir tanesi seçilmesi gerekiyor*`
                
                case "selected":
                    return `seçim yapılması gerekmektedir*`

                default:
                    return "boş"
            }
        }

        // #region just only masking callback function
        inputNumberEvent = function(){
            this.value = this.value.replace(/[^0-9]/g, '');
        }

        inputPhoneEvent = function(){
            this.value = this.value.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '$1-$2-$3');
        }
        // #endregion

        // #region button click validation callback function
        checkboxEvent = function($el){
            if($($el).is(':checked')){
                return true
            }else{
                return false;
            }
        }

        radioButtonEvent = function($el){
            if($('input[name='+$($el).attr("name")+']:checked').length != 0){
                return true
            }else{
                return false;
            }
        }
       
        inputmailEvent = function($el){
            var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            if (filter.test($el)) {
                return true;
            }
            else {
                return false;
            }
        }
    
        inputWebsiteEvent = function($el){
            var Inicio_URL = ['http://www', 'https://www', 'www', 'ftp://www'];
            var Fim_URL = ['com', 'net', 'org', 'pt', 'eu','co'];

            var Url_Inserido = $el.toLowerCase().split(".");

            if (Inicio_URL.includes(Url_Inserido[0])) {

                if (Fim_URL.includes(Url_Inserido[(Url_Inserido.length - 1)])) {
                    return true;
                } else
                    return false;

            } else
                return false;
        }
        
        inputPasswordEvent = function($el){
            var strength = 0
            if ($el.length > 7) strength += 1
            if ($el.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))  strength += 1;
            if ($el.match(/([a-zA-Z])/) && $el.match(/([0-9])/))  strength += 1;
            if ($el.match(/([!,%,&,@,#,$,^,*,?,_,~])/))  strength += 1;
            if ($el.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,",%,&,@,#,$,^,*,?,_,~])/)) strength += 1;
            if (strength < 2 ) {
                return false;
            }else{
                return true
            }
        }
        //#endregion
        
        // #region ajax  request
        ajaxRequest = function(){
            if(options.ajaxRequest.isAjax){
                $.ajax({
                    type: options.ajaxRequest.type,
                    url: options.ajaxRequest.requstUrl,
                    data: options.postData.data(),
                    dataType: options.ajaxRequest.dataType,
                    beforeSend: options.ajaxRequest.beforeSend,
                    success: options.ajaxRequest.success,
                    error: options.ajaxRequest.error,
                })
            }
        }
        // #endregion
        
        init();
    }
})(jQuery)