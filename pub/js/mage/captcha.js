/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE_AFL.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Magento to newer
 * versions in the future. If you wish to customize Magento for your
 * needs please refer to http://www.magentocommerce.com for more information.
 *
 * @category    Mage
 * @package     js
 * @copyright   Copyright (c) 2012 Magento Inc. (http://www.magentocommerce.com)
 * @license     http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */
var Captcha = Class.create();
Captcha.prototype = {
    initialize: function(url, formId){
        this.url = url;
        this.formId = formId;
    },
    refresh: function(elem) {
        formId = this.formId;
        if (elem) Element.addClassName(elem, 'refreshing');
        new Ajax.Request(this.url, {
            onSuccess: function (response) {
                if (response.responseText.isJSON()) {
                    var json = response.responseText.evalJSON();
                    if (!json.error && json.imgSrc) {
                        $(formId).writeAttribute('src', json.imgSrc);
                        if (elem) Element.removeClassName(elem, 'refreshing');
                    } else {
                        if (elem) Element.removeClassName(elem, 'refreshing');
                    }
                }
            },
            method: 'post',
            parameters: {
                'formId'   : this.formId
            }
        });
    }
};

document.observe('billing-request:completed', function(event){
    if (window.checkout !== undefined){
        if (window.checkout.method == 'guest' && $('guest_checkout')){
            window.captcha_guest_checkout.refresh()
        }
        if (window.checkout !== undefined && window.checkout.method== 'register' && $('register_during_checkout')){
            window.captcha_register_during_checkout.refresh()
        }
    }
});


document.observe('login:setMethod', function(event){
    switch(event.memo.method){
        case 'guest':
            if ($('register_during_checkout')) {
                $('captcha-input-box-register_during_checkout').hide();
                $('captcha-image-box-register_during_checkout').hide();
                $('captcha-input-box-guest_checkout').show();
                $('captcha-image-box-guest_checkout').show();

            }
            break;
        case 'register':
            if ($('guest_checkout')) {
                $('captcha-input-box-guest_checkout').hide();
                $('captcha-image-box-guest_checkout').hide();
                $('captcha-input-box-register_during_checkout').show();
                $('captcha-image-box-register_during_checkout').show();

            }
            break;
    }
});
