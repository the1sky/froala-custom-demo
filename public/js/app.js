/**
 * Created by nant on 16/8/4.
 */

$(function () {
  //@处理
  // Define data source for At.JS.
  var datasource = ["Jacob", "Isabella", "Ethan", "Emma", "Michael", "Olivia"];

  // Build data to be used in At.JS config.
  var names = $.map(datasource, function (value, i) {
    return {
      'id': i, 'name': value, 'email': value + "@email.com"
    };
  });

  // Define config for At.JS.
  var config = {
    at: "@",
    data: names,
    displayTpl: '<li>${name} <small>${email}</small></li>',
    limit: 200
  };

  //localstorage
  var storage = $.localStorage;

  $('div#froala-editor').on('froalaEditor.initialized', function (e, editor) {
    //初始化处理
    editor.$el.atwho(config);
    editor.html.set(storage.get('kb-editor'));
    
    editor.events.on('keydown', function (e) {
      if (e.which == $.FroalaEditor.KEYCODE.ENTER && editor.$el.atwho('isSelecting')) {
        return false;
      }
    }, true);
  }).on('froalaEditor.contentChanged', function (e, editor) {
    //内容变更处理
    storage.set('kb-editor', editor.html.get());
  }).froalaEditor({
    //初始化配置
    imageUploadURL: '/upload_image',
    toolbarButtonsSM: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'outdent', 'indent', 'clearFormatting', 'insertTable', 'html'],
    toolbarButtonsXS: ['bold', 'italic', 'underline','at','image-custom'],
    pluginsEnabled: null,
    imageEditButtons: [],
    language: 'zh_cn',
    heightMax: 300
  });
});
