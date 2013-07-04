(function($) {
  $.fn.WFMspecialDiets = function(options) {
    var sd = {
      element: this,
      options: $.extend({

      }, options),

      init: function(){
        sd.listeners();
      },

      addSpinner: function(){
        var src = 'http://wholefoodsmarket.com/sites/all/themes/wholefoods/images/ajax-loader3.gif';
        var img = '<img src="' + src + '" alt="loading..." class="spinner" />';
        $(sd.element).append(img);
      },

      removeSpinner: function(){
        $(sd.element).children('img').remove();
      },

      checkSelects: function(){
        var store = sd.getStore();
        var diet = sd.getDiet();
        if (store !== null && diet !== null) {
          sd.getXML(store, diet);
        }
      },

      clear: function(){
        $(this.element).html('');
      },

      displayPDFlink: function(store, diet) {
        var url = sd.getURL(store, diet, 'pdf');
        switch (diet) {
          case 'Gluten_Free':
            var linktext = 'Download the Gluten Free shopping list PDF';
            break;
          case 'Gluten_and_Casein_Free':
            var linktext = 'Download the Gluten and Casein Free shopping list PDF';
            break;
          case 'Non_GMO_Project_Verified_Products':
            var linktext = 'Download the Non-GMO Project verified products shopping list PDF';
            break;
          case 'Premium_Body_Care_Products':
            var linktext = 'Download the Premium Body Care products shopping list PDF';
            break;         
        }
        var link = '<a href="' + url + '">' + linktext + '</a>';
        $(this.element).append(link);
      },

      getDiet: function(){
        var diet = $('#diets').val();
        if (diet === '') {
          return null;
        }
        return diet;
      },

      getStore: function(){
        var store = $('#stores').val();
        if (store === '') {
          return null;
        }
        return store;
      },

      getURL: function(store, diet, filetype) {
        var url = 'http://www2.wholefoodsmarket.com/specialdiets/' + store + '_' + diet + '.' + filetype;
        return url;
      },

      getXML: function(store, diet){
        var url = sd.getURL(store, diet, 'xml');

        $.ajax({
            url: 'fetch.php',
            type: 'POST',

            data: {
              'url': url,
            },
            dataType: 'xml',
            beforeSend: function(jqXHR, settings){
              sd.addSpinner();
            },
            success: function(data) {
              sd.removeSpinner();
              sd.displayPDFlink(store, diet);
              sd.parseXML(data);
            },
          });
      },

      listeners: function(){
        $('select').change(function(){
          sd.clear();
          sd.checkSelects();
        });
      },

      parseXML: function(xml){
        var category = $(xml).children('category');
        var title = category.children('title').text();
        var listname = category.children('catname').text();
        sd.setTitle(title, listname);
        category.children('class').each(function(){
          var categoryname = $(this).children('classname').text();
          sd.setSubtitle(categoryname);
          $(this).children('labelbrand').each(function(){
            var brandname = $(this).children('brandname').text();
            var items = $(this).children('branditem');
            sd.setBrandTitle(brandname);
            sd.setListItems(items);
          });
        });
      },

      setBrandTitle: function(text){
        $(this.element).append('<h4>' + text + '</h4>');
      },

      setListItems: function(items){
        $(this.element).append('<ul></ul>');
        items.each(function(){
          var text = $(this).text();
          $(sd.element).children('ul').last().append('<li>' + text + '</li>');
        });
      },

      setTitle: function(storename, listname){
        var storesplit = storename.split(',');
        var titletext = listname + ' List: ' + storesplit[0];
        $(this.element).prepend('<h2>' + titletext + '</h2>');
      },

      setSubtitle: function(text){
        $(this.element).append('<h3>' + text + '</h3>');
      },
    };

    sd.init();
  };
})(jQuery);